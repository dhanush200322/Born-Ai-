# backend/test_data_isolation.py
import os
import requests
import uuid
from dotenv import load_dotenv
from supabase import create_client

def run_tests():
    # Load environment variables
    load_dotenv()
    
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
    SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if not all([SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY]):
        print("Error: Missing Supabase credentials in .env")
        return

    # Initialize admin client
    admin_client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    email_a = f"usera_test_{uuid.uuid4().hex[:6]}@bornai.com"
    email_b = f"userb_test_{uuid.uuid4().hex[:6]}@bornai.com"
    password = "testpassword123"
    
    print(f"Testing with accounts:\nUser A: {email_a}\nUser B: {email_b}")
    
    # Create test users
    try:
        user_a_res = admin_client.auth.admin.create_user({
            "email": email_a,
            "password": password,
            "email_confirm": True
        })
        user_a_id = user_a_res.user.id
        print(f"Created User A with ID: {user_a_id}")
        
        user_b_res = admin_client.auth.admin.create_user({
            "email": email_b,
            "password": password,
            "email_confirm": True
        })
        user_b_id = user_b_res.user.id
        print(f"Created User B with ID: {user_b_id}")
    except Exception as e:
        print(f"Failed to create test users: {e}")
        return

    # Sign in to get JWT access tokens
    try:
        client_a = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        session_a = client_a.auth.sign_in_with_password({"email": email_a, "password": password})
        token_a = session_a.session.access_token
        
        client_b = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        session_b = client_b.auth.sign_in_with_password({"email": email_b, "password": password})
        token_b = session_b.session.access_token
    except Exception as e:
        print(f"Failed to sign in: {e}")
        # Cleanup users before exiting
        admin_client.auth.admin.delete_user(user_a_id)
        admin_client.auth.admin.delete_user(user_b_id)
        return

    # Set auth headers
    headers_a = {"Authorization": f"Bearer {token_a}", "Content-Type": "application/json"}
    headers_b = {"Authorization": f"Bearer {token_b}", "Content-Type": "application/json"}
    
    agent_id = None
    
    try:
        # 1. Deploy agent for User A
        deploy_url = "http://127.0.0.1:8000/api/agents/deploy"
        payload = {
            "agent_details": {
                "name": "Test Isolation Agent A",
                "description": "Agent belonging to User A",
                "role": "Tester"
            },
            "knowledge_base": {"files": [], "website_urls": [], "faqs": []},
            "memory_config": {"session_memory_enabled": True, "long_term_memory_enabled": False, "retention_period_days": 90},
            "channels": {"website": False, "whatsapp": False, "telegram": False, "voice": False, "api": False}
        }
        
        print("\nDeploying agent for User A...")
        r = requests.post(deploy_url, json=payload, headers=headers_a)
        assert r.status_code == 200, f"Deploy failed: {r.text}"
        res = r.json()
        agent_id = res["agent_id"]
        print(f"Success: Deployed agent {agent_id} for User A")
        
        # 2. Verify listing visibility
        print("\nChecking listing isolation...")
        list_url = "http://127.0.0.1:8000/api/agents/"
        
        r_a = requests.get(list_url, headers=headers_a)
        agents_a = r_a.json().get("agents", [])
        assert any(a["id"] == agent_id for a in agents_a), "User A should see their deployed agent"
        print("Pass: User A sees their own agent in the listing.")
        
        r_b = requests.get(list_url, headers=headers_b)
        agents_b = r_b.json().get("agents", [])
        assert not any(a["id"] == agent_id for a in agents_b), "User B should NOT see User A's agent"
        print("Pass: User B cannot see User A's agent in the listing.")
        
        # 3. Verify detail endpoint isolation
        print("\nChecking detail endpoint isolation...")
        detail_url = f"http://127.0.0.1:8000/api/agents/{agent_id}"
        
        r_a = requests.get(detail_url, headers=headers_a)
        assert r_a.status_code == 200, f"User A should get 200 OK: {r_a.text}"
        print("Pass: User A can access their own agent details.")
        
        r_b = requests.get(detail_url, headers=headers_b)
        assert r_b.status_code == 404, f"User B should get 404 Not Found: {r_b.status_code} {r_b.text}"
        print("Pass: User B is forbidden and receives 404 when querying User A's agent details.")

        # 4. Verify dashboard stats isolation
        print("\nChecking dashboard stats isolation...")
        stats_url = "http://127.0.0.1:8000/api/agents/dashboard/stats"
        
        r_a = requests.get(stats_url, headers=headers_a)
        stats_a = r_a.json()["stats"]
        assert stats_a["total_agents"] == 1, f"User A stats should show 1 agent, got {stats_a}"
        
        r_b = requests.get(stats_url, headers=headers_b)
        stats_b = r_b.json()["stats"]
        assert stats_b["total_agents"] == 0, f"User B stats should show 0 agents, got {stats_b}"
        print("Pass: Dashboard statistics are strictly isolated.")
        print(f"User A agent count: {stats_a['total_agents']}")
        print(f"User B agent count: {stats_b['total_agents']}")
        
        print("\nALL DATA ISOLATION TESTS PASSED SUCCESSFULLY!")
        
    except Exception as e:
        print(f"\nTEST FAILURE: {e}")
    finally:
        # Cleanup
        print("\nCleaning up database...")
        if agent_id:
            admin_client.table('agents').delete().eq('id', agent_id).execute()
            print("Deleted test agent.")
        admin_client.auth.admin.delete_user(user_a_id)
        admin_client.auth.admin.delete_user(user_b_id)
        print("Deleted test users.")

if __name__ == "__main__":
    run_tests()
