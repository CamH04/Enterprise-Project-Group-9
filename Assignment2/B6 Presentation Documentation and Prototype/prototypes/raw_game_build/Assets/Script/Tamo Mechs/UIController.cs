using UnityEngine;
using UnityEngine.UI;

public class UIController : MonoBehaviour
{
    public Pet pet;
    public Button feedButton;
    public Button petButton;
    public Slider hungerSlider;
    public Slider happinessSlider;
    public Text hungerText;
    public Text happinessText;

    private float hungerSmoothVelocity;
    private float happinessSmoothVelocity;
    public float smoothTime = 0.2f;

    void Start()
    {
        feedButton.onClick.AddListener(FeedPet);
        petButton.onClick.AddListener(PetPet);
    }

    void Update()
    {
        float targetHunger = 1f - (pet.hunger / 100f);
        float targetHappiness = pet.happiness / 100f;

        hungerSlider.value = Mathf.SmoothDamp(hungerSlider.value, targetHunger, ref hungerSmoothVelocity, smoothTime);
        happinessSlider.value = Mathf.SmoothDamp(happinessSlider.value, targetHappiness, ref happinessSmoothVelocity, smoothTime);

        hungerText.text = "Hungry-O-Meter: " + pet.hunger.ToString("F0");
        happinessText.text = "Cuddle-O-Meter: " + pet.happiness.ToString("F0");
    }

    void FeedPet()
    {
        pet.Feed();
    }

    void PetPet()
    {
        pet.PetPet();
    }
}
