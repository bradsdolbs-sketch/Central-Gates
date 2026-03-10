import requests
import sys
from datetime import datetime
import uuid

class CentralGateEstatesAPITester:
    def __init__(self):
        self.base_url = "https://landlord-portal-17.preview.emergentagent.com/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.created_property_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        default_headers = {'Content-Type': 'application/json'}
        if headers:
            default_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=default_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=default_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=default_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=default_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json() if response.text else {}
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        success, response = self.run_test(
            "API Root",
            "GET",
            "",
            200
        )
        return success

    def test_contact_form_submission(self):
        """Test contact form submission"""
        contact_data = {
            "full_name": "Test User",
            "phone_number": "+44 7123 456 789",
            "email": "test@example.com",
            "number_of_properties": "2-5",
            "looking_for": "Full Management",
            "message": "This is a test enquiry for the property management service."
        }
        
        success, response = self.run_test(
            "Contact Form Submission",
            "POST",
            "contact",
            200,
            data=contact_data
        )
        
        if success and response:
            if 'id' in response:
                print(f"   Contact submission ID: {response['id']}")
                return True
        return False

    def test_get_contact_submissions(self):
        """Test retrieving contact submissions"""
        success, response = self.run_test(
            "Get Contact Submissions",
            "GET",
            "contact",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} contact submissions")
            return True
        return False

    def test_get_properties(self):
        """Test getting all properties"""
        success, response = self.run_test(
            "Get All Properties",
            "GET",
            "properties",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} properties")
            if len(response) > 0:
                # Store first property for testing viewing request
                self.created_property_id = response[0].get('id')
                print(f"   First property ID: {self.created_property_id}")
            return True
        return False

    def test_get_available_properties(self):
        """Test getting only available properties"""
        success, response = self.run_test(
            "Get Available Properties",
            "GET",
            "properties?available_only=true",
            200
        )
        
        if success and isinstance(response, list):
            available_count = sum(1 for prop in response if prop.get('is_available', False))
            print(f"   Found {available_count} available properties out of {len(response)}")
            return True
        return False

    def test_create_property(self):
        """Test creating a new property"""
        property_data = {
            "address": "123 Test Street, W1T 1AA",
            "bedrooms": 2,
            "rent_per_month": 2500,
            "available_date": "2025-02-15",
            "image_url": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
            "description": "Test property for API testing",
            "is_available": True
        }
        
        success, response = self.run_test(
            "Create Property",
            "POST",
            "properties",
            200,
            data=property_data
        )
        
        if success and response:
            if 'id' in response:
                self.created_property_id = response['id']
                print(f"   Created property ID: {self.created_property_id}")
                return True
        return False

    def test_get_single_property(self):
        """Test getting a single property by ID"""
        if not self.created_property_id:
            print("   ⚠️  No property ID available for single property test")
            return False
            
        success, response = self.run_test(
            "Get Single Property",
            "GET",
            f"properties/{self.created_property_id}",
            200
        )
        
        if success and response:
            if response.get('id') == self.created_property_id:
                print(f"   Retrieved property: {response.get('address')}")
                return True
        return False

    def test_viewing_request(self):
        """Test viewing request submission"""
        if not self.created_property_id:
            print("   ⚠️  No property ID available for viewing request test")
            return False
            
        viewing_data = {
            "property_id": self.created_property_id,
            "full_name": "Test Viewer",
            "email": "viewer@example.com",
            "phone_number": "+44 7987 654 321",
            "preferred_date": "2025-02-20",
            "message": "I would like to schedule a viewing for this property."
        }
        
        success, response = self.run_test(
            "Viewing Request Submission",
            "POST",
            "viewing",
            200,
            data=viewing_data
        )
        
        if success and response:
            if 'id' in response:
                print(f"   Viewing request ID: {response['id']}")
                return True
        return False

    def test_get_viewing_requests(self):
        """Test retrieving viewing requests"""
        success, response = self.run_test(
            "Get Viewing Requests",
            "GET",
            "viewing",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} viewing requests")
            return True
        return False

    def test_seed_properties(self):
        """Test seeding sample properties"""
        success, response = self.run_test(
            "Seed Properties",
            "POST",
            "seed-properties",
            200
        )
        
        if success and response:
            if 'message' in response:
                print(f"   Seeding result: {response['message']}")
                return True
        return False

    def test_invalid_property_request(self):
        """Test invalid property ID request (should return 404)"""
        invalid_id = str(uuid.uuid4())
        success, response = self.run_test(
            "Invalid Property ID (should fail)",
            "GET",
            f"properties/{invalid_id}",
            404
        )
        return success

    def test_invalid_viewing_request(self):
        """Test viewing request with invalid property ID (should return 404)"""
        viewing_data = {
            "property_id": str(uuid.uuid4()),  # Invalid property ID
            "full_name": "Test User",
            "email": "test@example.com",
            "phone_number": "+44 7000 000 000",
            "preferred_date": "2025-02-20",
            "message": "Test message"
        }
        
        success, response = self.run_test(
            "Invalid Viewing Request (should fail)",
            "POST",
            "viewing",
            404,
            data=viewing_data
        )
        return success

def main():
    """Main test runner"""
    print("🚀 Starting Central Gate Estates API Testing...")
    print("=" * 60)
    
    tester = CentralGateEstatesAPITester()
    
    # Test sequence
    tests = [
        tester.test_api_root,
        tester.test_seed_properties,  # Seed properties first to ensure we have test data
        tester.test_get_properties,
        tester.test_get_available_properties,
        tester.test_create_property,
        tester.test_get_single_property,
        tester.test_contact_form_submission,
        tester.test_get_contact_submissions,
        tester.test_viewing_request,
        tester.test_get_viewing_requests,
        tester.test_invalid_property_request,
        tester.test_invalid_viewing_request,
    ]
    
    # Run all tests
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test {test.__name__} failed with exception: {str(e)}")
    
    # Print summary
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed - check the output above for details")
        return 1

if __name__ == "__main__":
    sys.exit(main())