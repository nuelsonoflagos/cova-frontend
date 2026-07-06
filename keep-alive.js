const cron = require('node-cron'); 

// Every 6 days, make an API call to keep project alive 
cron.schedule('0 0 */6 * *', async () => { 
  try {
    await fetch('https://sipbkoxamzsurjsojsov.supabase.co', { 
      headers: { 
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY || 'YOUR_ANON_KEY'}` 
      } 
    }); 
    console.log('Supabase project kept alive'); 
  } catch (error) {
    console.error('Error keeping Supabase alive:', error);
  }
});
