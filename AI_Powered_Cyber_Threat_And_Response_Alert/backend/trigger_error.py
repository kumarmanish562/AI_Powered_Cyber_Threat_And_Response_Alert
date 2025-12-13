import requests
import json

# URL of the backend
url = "http://localhost:8000/api/analyze"

# You need a valid token to hit this endpoint.
# Since we can't easily get a token without logging in, this script assumes 
# valid traffic data but might fail with 401 if not auth.
# Oh, the user is logged in on the frontend.
# I will try to use the `debug_alerts.py` approach or just WAIT for the user.
# But wait, I can assume the user will click.

# Alternative: Check error_log.txt directly?
# It might already exist if the user clicked recently? No, I just added the code.

print("Please click 'Simulate Attack' in the browser.")
