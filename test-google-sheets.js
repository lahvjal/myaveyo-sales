// Quick test script to debug Google Sheets authentication
const { GoogleAuth } = require('google-auth-library');
const { google } = require('googleapis');

async function testGoogleSheetsAuth() {
  console.log('Testing Google Sheets authentication...');
  
  // Check environment variables
  console.log('Environment variables check:');
  console.log('GOOGLE_PROJECT_ID:', process.env.GOOGLE_PROJECT_ID ? '✓ Set' : '✗ Missing');
  console.log('GOOGLE_PRIVATE_KEY_ID:', process.env.GOOGLE_PRIVATE_KEY_ID ? '✓ Set' : '✗ Missing');
  console.log('GOOGLE_PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? '✓ Set' : '✗ Missing');
  console.log('GOOGLE_CLIENT_EMAIL:', process.env.GOOGLE_CLIENT_EMAIL ? '✓ Set' : '✗ Missing');
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✓ Set' : '✗ Missing');
  console.log('GOOGLE_SHEETS_LEADERBOARD_ID:', process.env.GOOGLE_SHEETS_LEADERBOARD_ID ? '✓ Set' : '✗ Missing');
  console.log('GOOGLE_SHEETS_GID:', process.env.GOOGLE_SHEETS_GID ? '✓ Set' : '✗ Missing');
  
  try {
    // Test authentication
    const auth = new GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Test spreadsheet access
    const spreadsheetId = process.env.GOOGLE_SHEETS_LEADERBOARD_ID;
    console.log('\nTesting spreadsheet access...');
    console.log('Spreadsheet ID:', spreadsheetId);
    
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });
    
    console.log('✓ Successfully connected to spreadsheet:', response.data.properties?.title);
    console.log('Available sheets:');
    response.data.sheets?.forEach(sheet => {
      console.log(`  - ${sheet.properties?.title} (ID: ${sheet.properties?.sheetId})`);
    });
    
    // Test data fetch
    console.log('\nTesting data fetch...');
    const dataResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'A:X',
    });
    
    const rows = dataResponse.data.values;
    console.log(`✓ Successfully fetched ${rows?.length || 0} rows`);
    if (rows && rows.length > 0) {
      console.log('First row (headers):', rows[0]);
      if (rows.length > 1) {
        console.log('Second row (first data):', rows[1]);
      }
    }
    
  } catch (error) {
    console.error('✗ Error:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.details) {
      console.error('Error details:', error.details);
    }
  }
}

testGoogleSheetsAuth();
