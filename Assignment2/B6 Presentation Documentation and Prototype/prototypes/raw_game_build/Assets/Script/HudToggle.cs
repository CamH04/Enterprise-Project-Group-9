using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

public class HudToggle : MonoBehaviour
{
    public RectTransform hudParent;
    public Button toggleButton;
    public float animationTime = 0.3f;
    public Vector3 hiddenScale = new Vector3(1, 0, 1);
    public Vector3 shownScale = Vector3.one;

    private bool isVisible = true;
    private Coroutine currentAnimation;

    private List<RectTransform> childRects = new List<RectTransform>();

    // Please never do anything that happens in this script it is jank
    // i recursivly go to each child and do the animations and collapse them
    // never let me touch hud code again
    void Start()
    {
        if (toggleButton != null) toggleButton.onClick.AddListener(ToggleHUD);
        childRects.Clear();
        foreach (RectTransform rect in hudParent.GetComponentsInChildren<RectTransform>(true))
        {
            if (rect != hudParent)
                childRects.Add(rect);
        }
    }

    void ToggleHUD()
    {
        if (currentAnimation != null)
            StopCoroutine(currentAnimation);

        Vector3 targetScale = isVisible ? hiddenScale : shownScale;
        currentAnimation = StartCoroutine(AnimateHUD(targetScale));

        isVisible = !isVisible;
    }

    System.Collections.IEnumerator AnimateHUD(Vector3 targetScale)
    {
        float elapsed = 0f;
        List<Vector3> startScales = new List<Vector3>();
        foreach (RectTransform rect in childRects)
        {
            startScales.Add(rect.localScale);
        }

        while (elapsed < animationTime)
        {
            float t = elapsed / animationTime;
            float smoothed = Mathf.SmoothStep(0, 1, t);
            for (int i = 0; i < childRects.Count; i++)
            {
                childRects[i].localScale = Vector3.Lerp(startScales[i], targetScale, smoothed);
            }

            elapsed += Time.deltaTime;
            yield return null;
        }
        foreach (RectTransform rect in childRects)
        {
            rect.localScale = targetScale;
        }
    }
}
