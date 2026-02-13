# Melius Operarius Documentation

Melius Operarius is an advanced version of Melius Engine that manages websites through a Pantry bucket. It allows for theme updates, new page creation, and special dynamic components using a tagging system.

## 1. Pantry Setup
Melius Operarius uses [Pantry](https://getpantry.cloud/) as its backend.
- **PANTRY_ID**: Must be set in your environment variables/secrets.
- **Main Basket**: `melius_instructions`
- **Forms Registry**: `melius_forms`

## 2. Instruction Structure (`melius_instructions`)
Store this JSON in a basket named `melius_instructions`:

```json
{
  "theme": {
    "description": "e.g., 'Modern dark mode with neon blue accents'",
    "primary_color": "#00d4ff",
    "secondary_color": "#0055ff"
  },
  "special_mentions": "Any specific instructions for the AI",
  "pages": [
    {
      "id": "home",
      "title": "Welcome",
      "content": "This is our new homepage with a {sales_banner}Special Opening Offer!{/sales_banner}",
      "strict_text": "This text will not be modified by AI."
    }
  ],
  "special_tags": [
    "{form}Contact Us{/form}",
    "{countdown}2026-12-31{/countdown}",
    "{live_time}",
    "{sales_banner}Text{/sales_banner}",
    "{discount_banner}Text{/discount_banner}",
    "{product_banner}Name|ImageURL|Price|BuyLink{/product_banner}",
    "{image}URL{/image}",
    "{video}URL{/video}"
  ]
}
```

## 3. Dynamic Features
- **Theme Logic**: AI only modifies CSS colors unless a holiday (New Year) is detected.
- **Strict Text**: Any text in `strict_text` fields is preserved exactly.
- **Form Integration**: Using `{form}...{/form}` automatically creates a submission basket in your Pantry and registers it in `melius_forms`.
- **Holidays**: If the AI detects a holiday like New Year, it can add wishes or specific offers defined in instructions.

## 5. Required Environment Variables / GitHub Secrets
Add these to your **GitHub Settings > Secrets and variables > Actions > Repository secrets**:

- `PANTRY_ID`: Your unique Pantry ID from https://getpantry.cloud/.
- `OPENROUTER_API_KEY_1`: Your primary OpenRouter API key.
- `OPENROUTER_API_KEY_2`: (Optional) Fallback API key.
- `OPENROUTER_API_KEY_3`: (Optional) Fallback API key.
- `OPENROUTER_API_KEY_4`: (Optional) Fallback API key.
- `OPENROUTER_API_KEY_5`: (Optional) Fallback API key.

## 6. Vercel Deployment
The `test-website` folder is ready for Vercel.
1. Connect your repository to Vercel.
2. Set the **Root Directory** to `melius-engine-new-main/test-website`.
3. Vercel will automatically use the `vercel.json` configuration.
