# Pantry Bucket Structure for melius-operarius

The `melius-operarius` engine reads instructions from a main Pantry bucket. The Pantry ID is stored in the `PANTRY_ID` environment variable.

## Main Bucket Structure (Basket Name: `melius_instructions`)
```json
{
  "theme": {
    "primary_color": "#hex",
    "secondary_color": "#hex",
    "background_color": "#hex",
    "text_color": "#hex",
    "description": "User's theme description (AI will derive colors if hex is null)"
  },
  "special_mentions": "Additional instructions for the AI",
  "pages": [
    {
      "id": "unique-page-id",
      "title": "Page Title (AI decides if null)",
      "theme": "Page specific theme (uses main if null)",
      "content": "Page content with {tags}",
      "strict_text": "Text that MUST be used exactly as is",
      "is_new_year": false,
      "offer_details": "Special offers or discounts (only if specified)"
    }
  ],
  "special_tags": [
    "{form}Contact Form Description{/form}",
    "{countdown}2026-01-01{/countdown}",
    "{live_time}",
    "{sales_banner}Text{/sales_banner}",
    "{discount_banner}Text{/discount_banner}",
    "{product_banner}Name|ImageURL|Price|BuyLink{/product_banner}",
    "{image}URL{/image}",
    "{video}URL{/video}"
  ]
}
```

## Forms Bucket (Basket Name: `melius_forms`)
Stores a list of active form names/baskets.
```json
{
  "active_forms": ["contact_form_1", "survey_2"]
}
```

## Individual Form Submission Baskets
Each form gets its own basket for storing submissions.
```json
{
  "submissions": [
    {
      "timestamp": "ISO-8601",
      "data": { "field1": "value1", "...": "..." }
    }
  ]
}
```
