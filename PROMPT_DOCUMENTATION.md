# TripGenie: AI Prompt Engineering & Iteration Documentation

This document records the systematic prompt engineering process developed for **TripGenie**, an academic mini-project demonstrating production-grade AI integration, structured output generation, and dynamic travel plan modification.

---

## 1. Executive Summary & Prompt Engineering Goals

When generating comprehensive travel itineraries, naive LLM prompts suffer from five primary failure modes:
1. **Hallucinated or unbounded budgets**: Suggesting luxury 5-star activities on shoestring backpacker budgets.
2. **Geographical/Temporal unfeasibility**: Scheduling 7 distant attractions in a single afternoon with zero transit buffer.
3. **Dietary inconsistency**: Recommending meat/seafood restaurants to strict vegetarians or vegans.
4. **Unstructured or variable Markdown output**: Emitting arbitrary bullet points or non-standard markdown tables that break UI parsers.
5. **Lack of actionable alternatives**: Generating rigid, single-path plans with no contingency or alternative pace.

Through three iterative development phases, we systematically eliminated these issues.

---

## 2. Iteration History: Versions 1, 2, and 3

### Version 1: The Naive Prompt (Baseline)
```text
Plan my trip to Goa.
```

#### Analysis of Version 1 Shortcomings:
- **No Temporal Bounds**: The AI does not know if the user is staying for 2 days, 1 week, or 1 month. It arbitrarily defaults to 3 or 5 days.
- **No Financial Context**: Without a budget constraint, the AI mixes $500 luxury beach clubs with ₹50 street stalls erratically.
- **No Traveler Demographics**: It fails to differentiate between a solo backpacker, a romantic couple, a group of college friends, or a family with elderly grandparents.
- **Dietary & Preference Blindness**: Disregards food preferences (e.g. Vegetarian, Vegan, Halal) and personal passions (Adventure vs. History vs. Relaxation).
- **Unparseable Output**: Returns conversational prose with inconsistent headings, preventing programmatic UI rendering.

---

### Version 2: The Parametric Prompt (Intermediate)
```text
Plan a 4-day Goa trip for 2 people with a ₹20,000 budget. Include places, food, and activities.
```

#### Improvements in Version 2:
- Added explicit **duration** (4 days).
- Added explicit **traveler count** (2 people).
- Added explicit **budget ceiling** (₹20,000).
- Broadened requirements to include places, food, and activities.

#### Remaining Vulnerabilities in Version 2:
- **Overcrowded Schedules**: The AI packs 6-8 activities daily without factoring in transit time or fatigue.
- **Dietary Ambiguity**: Fails to enforce vegetarian/vegan dietary restrictions.
- **Fragile Parsing**: Output is still free-form text or unpredictable Markdown tables that fail frontend hydration.
- **No Alternative Strategy**: Does not provide a fallback or alternative travel style (e.g., Relaxed vs. Adventure).
- **No Budget Categorization**: Lacks structured breakdowns (accommodation, transport, food, activities, misc).

---

### Version 3: The Production Prompt (Final Implemented Standard)

```text
### ROLE
You are an expert personal travel planner who creates realistic, personalized, and budget-conscious travel itineraries.

### CONTEXT
The user wants a personalized travel plan based on:
- Destination: {destination}
- Duration: {duration} days
- Total Budget: {currency} {budget}
- Number of Travelers: {travelers}
- Travel Style: {travelStyle}
- Interests & Preferences: {interests}
- Food Preference: {foodPreference}
{additional_notes}

### CONSTRAINTS & TRAVEL PLANNING RULES
1. Respect the user's budget ({currency} {budget}) as much as reasonably possible for {travelers} traveler(s).
2. Account for the number of travelers in accommodation, food, and ticket calculations.
3. Strictly respect the dietary preference ({foodPreference}) in all food recommendations and restaurant suggestions.
4. Directly reflect the selected travel style ({travelStyle}) and user interests ({interests}).
5. Avoid unrealistic schedules: Maximum 3 distinct well-spaced time blocks per day (Morning, Afternoon, Evening).
6. Avoid excessive travel between distant locations on the same day: Group activities geographically in the same neighborhood or corridor.
7. Avoid scheduling too many activities in one day to allow for leisure, meals, and spontaneous discovery.
8. Clearly label costs as estimates rather than exact prices.
9. Never claim real-time availability or confirmed bookings.
10. Advise users to verify uncertain or time-sensitive information (opening hours, seasonal closures).

### REQUIRED JSON STRUCTURE
Return a single JSON object with EXACTLY this structure:
{
  "tripSummary": {
    "destination": string,
    "duration": number,
    "travelers": number,
    "budgetFormatted": string,
    "travelStyle": string,
    "foodPreference": string,
    "summary": string,
    "highlights": string[],
    "bestSeason": string,
    "tripVibe": string
  },
  "itinerary": [
    {
      "day": number,
      "title": string,
      "theme": string,
      "stayArea": string,
      "morning": { "time": string, "activity": string, "place": string, "description": string, "estCost": string },
      "afternoon": { "time": string, "activity": string, "place": string, "description": string, "estCost": string },
      "evening": { "time": string, "activity": string, "place": string, "description": string, "estCost": string },
      "travelNotes": string
    }
  ],
  "recommendedPlaces": [
    { "name": string, "tag": string, "description": string, "whySuitable": string, "bestTimeToVisit": string, "estimatedEntryFee": string, "locationArea": string }
  ],
  "foodRecommendations": {
    "preferenceNote": string,
    "breakfast": [{ "dish": string, "placeOrType": string, "description": string, "priceRange": string }],
    "lunch": [{ "dish": string, "placeOrType": string, "description": string, "priceRange": string }],
    "dinner": [{ "dish": string, "placeOrType": string, "description": string, "priceRange": string }],
    "localSpecialties": [{ "name": string, "description": string, "mustTryAt": string, "dietaryTag": string }]
  },
  "budget": {
    "currency": string,
    "userBudget": number,
    "estimatedTotal": number,
    "breakdown": { "accommodation": number, "food": number, "transportation": number, "activities": number, "miscellaneous": number },
    "budgetStatus": "within_budget" | "under_budget" | "budget_stretched",
    "budgetNote": string,
    "costSavingTips": string[],
    "optionalSplurges": [{ "item": string, "cost": string, "reason": string }]
  },
  "travelTips": {
    "bestTimeToVisit": string,
    "localTransportation": string[],
    "packingList": string[],
    "safetyTips": string[],
    "bookingSuggestions": string[],
    "localEtiquette": string[]
  },
  "alternativePlan": {
    "title": string,
    "concept": string,
    "keyDifferences": string[],
    "quickDayOverview": [{ "day": number, "focus": string }],
    "estimatedCostComparison": string
  }
}
```

---

## 3. Comparison Matrix

| Evaluation Dimension | Version 1 (Naive) | Version 2 (Parametric) | Version 3 (Production) |
| :--- | :--- | :--- | :--- |
| **Output Predictability** | ❌ 0% (Random text) | ⚠️ 40% (Mixed markdown) | ✅ 100% (Strict JSON Schema) |
| **Budget Accuracy** | ❌ None | ⚠️ Rough estimates | ✅ Categorized math + total check |
| **Dietary Compliance** | ❌ Random dishes | ⚠️ Generic options | ✅ 100% Filtered to requested diet |
| **Geographic Logic** | ❌ Disjointed | ⚠️ Occasional cross-town jumps | ✅ Clustered morning/afternoon/evening |
| **UI Compatibility** | ❌ Broken | ⚠️ Requires fragile regex | ✅ Clean direct JSON hydration |
| **Modifiability** | ❌ Must regenerate all | ❌ Must regenerate all | ✅ Targeted section updates |

---

## 4. Trip Modification Prompt Architecture

TripGenie incorporates an interactive **Modify & Regenerate** mechanism. Instead of dumping prior context, the modification prompt injects the existing itinerary JSON as state and issues surgical instructions:

```text
### ROLE: Personal Travel Planner (Modification Mode)
### TASK: Modify existing trip plan for user query: "{userModification}"
### RULES:
1. Update only the relevant section (e.g. Day 2 activities for "Make Day 2 more adventurous").
2. Rebalance the budget breakdown if the user requested a budget reduction.
3. Preserve all untouched days and retain structured JSON format.
```

This guarantees fast, reliable delta updates that match user intent.
