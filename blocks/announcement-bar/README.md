# Announcement Bar

Displays a full-width promotional banner at the top of the page with optional countdown timer.

## Content Structure

| Row | Field | Description |
|-----|-------|-------------|
| 1 | Message | Promotional text shown in the bar |
| 2 | End date/time | ISO 8601 datetime string for the countdown timer (optional) |

## Example

| Announcement Bar |
|---|
| Free Standard Shipping on UK orders over £20 using code: FREE-SHIP |
| 2025-08-31T23:59:00Z |

## Behavior

- If an end date is provided, a live countdown (`00d 00h 00m 00s`) is displayed next to the message.
- When the countdown reaches zero the timer is hidden.
- If no end date is provided, only the message is shown.

## Styling

The bar uses `--lemieux-sage` as its background color. Override `--lemieux-sage` in `:root` to change the brand color.
