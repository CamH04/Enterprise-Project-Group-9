using UnityEngine;

public class RandomParticleSpawner : MonoBehaviour
{
    public GameObject[] particlePrefabs;
    public bool applyToChildren = true;

    public void SetApplyToChildren(bool value)
    {
        applyToChildren = value;
    }

    public void SpawnEffect()
    {
        if (applyToChildren)
        {
            foreach (Transform child in transform)
            {
                SpawnAt(child);
            }
        }
        else
        {
            SpawnAt(transform);
        }
    }

    private void SpawnAt(Transform target)
    {
        int index = Random.Range(0, particlePrefabs.Length);
        GameObject chosenEffect = particlePrefabs[index];
        Instantiate(chosenEffect, target.position + Random.insideUnitSphere * 0.3f, Quaternion.identity, target);
    }
}
