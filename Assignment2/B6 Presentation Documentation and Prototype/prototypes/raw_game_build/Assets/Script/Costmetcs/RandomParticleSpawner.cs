using UnityEngine;
using System.Collections;
using UnityEngine.Networking;
using System;

public class RandomParticleSpawner : MonoBehaviour
{
    public GameObject[] particlePrefabs;
    public bool applyToChildren = true;

    private const string unlockKey = "CosmeticUnlockTime";
    private const string selectedCosmeticIndexKey = "SelectedCosmeticIndex";

    public void SetApplyToChildren(bool value)
    {
        applyToChildren = value;
    }

    public void SpawnEffect()
    {
        if (!IsCosmeticUnlocked())
        {
            Debug.LogWarning("Cosmetic not unlocked or cooldown still active.");
            return;
        }

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
        int index = PlayerPrefs.GetInt(selectedCosmeticIndexKey, 0);
        if (index < 0 || index >= particlePrefabs.Length)
        {
            Debug.LogWarning("Invalid particle index.");
            return;
        }

        GameObject chosenEffect = particlePrefabs[index];
        Instantiate(chosenEffect, target.position + UnityEngine.Random.insideUnitSphere * 0.3f, Quaternion.identity, target);
    }

    private bool IsCosmeticUnlocked()
    {
        if (!PlayerPrefs.HasKey(unlockKey)) return false;

        string timeStr = PlayerPrefs.GetString(unlockKey);
        if (DateTime.TryParse(timeStr, null, System.Globalization.DateTimeStyles.RoundtripKind, out DateTime lastUnlock))
        {
            return (DateTime.UtcNow - lastUnlock).TotalHours < 24;
        }
        return false;
    }
}
