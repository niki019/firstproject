# Interactive Zomato-like Login Form

We will build a high-fidelity, interactive login form that matches the provided Zomato login UI. To make it premium and modern, we will implement it inside a beautiful centered modal layout with smooth animations, interactive transitions, and fully functional front-end flows (such as switching to OTP input or email input, custom country code dropdown, and validation).

## Design Features
- **Typography & Aesthetics**: Use the 'Outfit' Google Font for a modern, friendly, and readable look.
- **Card Design**: Center-aligned modal card with smooth border-radius, clean shadows (`box-shadow`), and a subtle backdrop blur on the page background.
- **Phone Input**: Custom dropdown selector for country code (with flags), a vertical divider, and a numeric input.
- **Micro-interactions**:
  - Enable/disable state for the main action button based on input validity.
  - Custom dropdown for country codes with flag search/selection.
  - Smooth animation transition from phone input to an OTP confirmation screen.
  - Interactive transition to Email Login view when "Continue with Email" is clicked.
  - Hover states for all buttons (slight lift, scale, or shadow transition).
- **Zomato Branding**: Precise Zomato-red color palette (`#EF4F5F`) and exact layouts for email/Google sign-in buttons.

## Proposed Changes

### Login Component Files

We will create the login form inside the newly initialized repository directory: [firstproject](file:///e:/firstproject).

#### [NEW] [index.html](file:///e:/firstproject/index.html)
The structure for the login modal:
- Modal wrapper and card.
- Country code dropdown overlay.
- Dynamic main container that can slide/fade between:
  - **Phone Login View** (Phone input + "Send One Time Password").
  - **OTP Verification View** (6-digit code inputs, resend timer, back button).
  - **Email Login View** (Email and password fields, login button, back button).
- Social login buttons ("Continue with Email", "Continue with Google").
- Footer registration link.

#### [NEW] [style.css](file:///e:/firstproject/style.css)
The style definitions:
- Root color tokens (Zomato red, grey shades, shadows).
- Resets and layout styles (flexbox/grid centering, backdrop styling).
- Custom inputs, animated states, and dropdown stylings.
- Keyframes for transition animations (e.g., slide-in, fade-in, pulse).

#### [NEW] [script.js](file:///e:/firstproject/script.js)
The interactive logic:
- Country code dropdown toggler and search filter.
- Form inputs validator (phone length validation).
- State transitions (Phone Login -> OTP Verification, Phone Login -> Email Login).
- 6-digit OTP auto-focus movement (moving cursor to next box automatically).
- Countdown timer logic for OTP resend.
- Simulated successful login toast notification.

---

## Verification Plan

### Manual Verification
- Open `index.html` in a web browser.
- Verify visual styling: matches colors, border-radii, spacing, and icons in the user's reference image.
- Test interaction:
  - Open and select different country codes from the dropdown.
  - Enter a phone number, verify the "Send One Time Password" button state matches entry.
  - Click "Send One Time Password" and verify the smooth animation to the OTP screen.
  - Test OTP auto-focus and countdown timer.
  - Click "Continue with Email" and verify switcher to Email form.
