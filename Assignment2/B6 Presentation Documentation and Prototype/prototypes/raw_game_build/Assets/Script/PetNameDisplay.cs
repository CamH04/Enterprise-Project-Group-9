using System.Collections;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;
using TMPro;

public class PetNameDisplay : MonoBehaviour
{
    [Header("Name Tag 1")]
    public TextMeshProUGUI nameTagText1;
    public Canvas nameTagCanvas1;
    public Transform nameTag1Transform;

    [Header("Name Tag 2")]
    public TextMeshProUGUI nameTagText2;
    public Canvas nameTagCanvas2;
    public Transform nameTag2Transform;

    [Header("Name Tag 3")]
    public TextMeshProUGUI nameTagText3;
    public Canvas nameTagCanvas3;
    public Transform nameTag3Transform;

    [Header("UI Login")]
    public GameObject loginPanel;
    public TMP_InputField usernameInput;
    public TMP_InputField passwordInput;
    public Button loginButton;

    private string token;
    private string baseUrl = "http://localhost:5000";

    void Start()
    {
        nameTagCanvas1.gameObject.SetActive(false);
        nameTagCanvas2.gameObject.SetActive(false);
        nameTagCanvas3.gameObject.SetActive(false);

        loginButton.onClick.AddListener(() => StartCoroutine(Login()));
    }

    void Update(){
        if (nameTagCanvas1.gameObject.activeSelf)
            nameTagCanvas1.transform.rotation = Quaternion.LookRotation(nameTag1Transform.position - Camera.main.transform.position);

        if (nameTagCanvas2.gameObject.activeSelf)
            nameTagCanvas2.transform.rotation = Quaternion.LookRotation(nameTag2Transform.position - Camera.main.transform.position);

        if (nameTagCanvas3.gameObject.activeSelf)
            nameTagCanvas3.transform.rotation = Quaternion.LookRotation(nameTag3Transform.position - Camera.main.transform.position);
    }

    IEnumerator Login()
    {
        string username = usernameInput.text;
        string password = passwordInput.text;

        var json = $"{{\"username\":\"{username}\",\"password\":\"{password}\"}}";
        var request = new UnityWebRequest($"{baseUrl}/login", "POST");
        byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(json);
        request.uploadHandler = new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");

        yield return request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.Success)
        {
            var responseText = request.downloadHandler.text;
            Debug.Log("Login response: " + responseText);
            TokenResponse tokenData = JsonUtility.FromJson<TokenResponse>(responseText);
            token = tokenData.token;

            loginPanel.SetActive(false);
            StartCoroutine(GetPetName());
        }
        else
        {
            Debug.LogError("Login failed: " + request.error);
        }
    }

    IEnumerator GetPetName(){
        var request = UnityWebRequest.Get($"{baseUrl}/getPetName");
        request.SetRequestHeader("Authorization", $"Bearer {token}");

        yield return request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.Success)
        {
            var result = JsonUtility.FromJson<PetNameResponse>(request.downloadHandler.text);
            string formattedName = $"Say Hello To: {result.petName} !";

            nameTagText1.text = formattedName;
            nameTagText2.text = formattedName;
            nameTagText3.text = formattedName;

            nameTagCanvas1.gameObject.SetActive(true);
            nameTagCanvas2.gameObject.SetActive(true);
            nameTagCanvas3.gameObject.SetActive(true);
        }
        else
        {
            Debug.LogError("Failed to get pet name: " + request.error);
        }
    }


    [System.Serializable]
    public class TokenResponse
    {
        public string token;
    }

    [System.Serializable]
    public class PetNameResponse
    {
        public string petName;
    }
}
