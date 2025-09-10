# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets API access for your private spreadsheet to power the leaderboard.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID for later

## Step 2: Enable Google Sheets API

1. In Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

## Step 3: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the details:
   - **Name**: `aveyo-leaderboard-service`
   - **Description**: `Service account for accessing leaderboard spreadsheet`
4. Click "Create and Continue"
5. Skip role assignment for now (click "Continue")
6. Click "Done"

## Step 4: Generate Service Account Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create New Key"
4. Select "JSON" format
5. Download the JSON file - **keep this secure!**

## Step 5: Share Your Spreadsheet

1. Open your private Google Spreadsheet
2. Click "Share" button
3. Add the service account email (found in the JSON file as `client_email`)
4. Give it "Viewer" permissions
5. Copy the Spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

## Step 6: Set Up Environment Variables

Add these to your `.env.local` file:

```env
# Google Sheets API Configuration
GOOGLE_PROJECT_ID=your_project_id_from_json
GOOGLE_PRIVATE_KEY_ID=private_key_id_from_json
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
GOOGLE_CLIENT_EMAIL=client_email_from_json
GOOGLE_CLIENT_ID=client_id_from_json

# Spreadsheet Configuration
GOOGLE_SHEETS_LEADERBOARD_ID=1YU6uHWgEPVVZqQeRAbkfmfWY1I4cXc1XLX-N5PGyVnU
GOOGLE_SHEETS_RANGE=Sheet1!A:X
```

## Step 7: Format Your Spreadsheet

Your spreadsheet should have these columns (Row 1 = Headers):

| A (Rep Name) | N (Total TSS 2025) | P (Closer TSS 2025) | R (Setter TSS 2025) | T (Total TSI 2025) | V (Closer TSI 2025) | X (Setter TSI 2025) |
|--------------|--------------------|--------------------|--------------------|-------------------|--------------------|--------------------|
| John Doe     | 200                | 100                | 100                | 100           | 50             | 50             |
| Jane Smith   | 180                | 90                 | 90                 | 80            | 40             | 40             |

**Column Details:**
- **A**: Sales rep name
- **N**: Total Solar Sold points (all roles) - TSS
- **P**: TSS points for closer role only
- **R**: TSS points for setter role only
- **T**: Total Solar Installed points (all roles) - TSI
- **V**: TSI points for closer role only
- **X**: TSI points for setter role only

## Step 8: Test the Integration

1. Start your development server: `npm run dev`
2. Visit `/api/leaderboard` to test the API
3. Check the leaderboard page to see your data

## Security Notes

- **Never commit** the service account JSON file to version control
- Keep your private key secure
- Only give the service account "Viewer" access to your spreadsheet
- Consider rotating keys periodically

## Troubleshooting

**"Authentication failed" error:**
- Check that all environment variables are set correctly
- Ensure the private key includes proper line breaks (`\n`)
- Verify the service account email has access to the spreadsheet

**"Spreadsheet not found" error:**
- Confirm the spreadsheet ID is correct
- Make sure the service account email is shared on the spreadsheet
- Check that the sheet name in the range matches your actual sheet

**"Range not found" error:**
- Verify your `GOOGLE_SHEETS_RANGE` matches your sheet structure
- Default is `Sheet1!A:F` - adjust if your sheet has a different name

## Example Spreadsheet Structure

```
Row 1: Name          | Deals | Revenue  | Region | Avatar           | Change
Row 2: Austin Smith  | 45    | 890000   | West   | /avatars/1.jpg   | 3
Row 3: Sarah Johnson | 42    | 820000   | East   | /avatars/2.jpg   | -1
Row 4: Mike Chen     | 38    | 750000   | Central| /avatars/3.jpg   | 0
```

The system will automatically:
- Sort by revenue (highest first)
- Assign ranks based on revenue
- Format revenue for display ($890K, $1.2M, etc.)
- Show position changes with colored indicators
