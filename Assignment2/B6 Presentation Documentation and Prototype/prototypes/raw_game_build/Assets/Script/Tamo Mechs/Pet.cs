using UnityEngine;

public class Pet : MonoBehaviour
{
    public float hunger = 100f;
    public float feedingRate = 10f;
    public float happiness = 50f;

    private float hungerDecayRate = 1f;
    private float happinessDecayRate = 0.1f;
    private bool isFed = false;

    void Start(){
        InvokeRepeating("IncreaseHunger", 1f, 1f);
        InvokeRepeating("DecreaseHappiness", 1f, 1f);
    }

    void Update(){
        hunger = Mathf.Max(hunger, 0f);
        happiness = Mathf.Clamp(happiness, 0f, 100f);
    }

    public void Feed(){
        hunger += feedingRate;
        hunger = Mathf.Min(hunger, 100f);
        isFed = true;
    }

    void IncreaseHunger(){
        if (!isFed)
        {
            hunger -= hungerDecayRate;
        }
        isFed = false;
    }
    void DecreaseHappiness(){
        happiness -= happinessDecayRate;
    }
    public void PetPet(){
        happiness += 10f;
        happiness = Mathf.Min(happiness, 100f);
    }
}
