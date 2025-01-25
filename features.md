# Feature Track

## Action items

### Architecture

#### Backlog

- [ ] Make sure clerk webhook works properly to save the new user in the database.

#### Backend Architecture

- [x] Design a modular backend architecture with clearly defined layers:
  - [x] API Layer for handling HTTP requests (controller).
  - [x] Service Layer for implementing business logic (services).
  - [x] Database Layer for interacting with storage systems (data stores).

#### Database Design

- [x] Set up a document database (e.g., MongoDB) for storing user profiles,
      preferences, and plans.
  - [x] Create collections: `UserProfile`, `UserPreferences`, `NutritionPlans`,
        `Goals` and `WorkoutPlans`.
  - [ ] Implement versioning for user preferences/history:
    - [ ] Use a `UserPreferences` collection for current data.
    - [ ] Use a `UserPreferencesHistory` collection for historical records.
    - [ ] Ensure every update triggers a write to the history collection with timestamps.
- [ ] Set up a time-series database (e.g., [InfluxDB](https://www.influxdata.com/)
      or [TimescaleDB](https://www.timescale.com/)) for tracking
      user progress over time.
  - [ ] Store metrics like weight, activity, nutrition logs, etc., with timestamps.

#### User Management system

- [x] Implement Auth System.
- [x] Move to Clerk for more robustness.

#### Function Calls

- [x] Write Function calls for interactions between different assistants.
- [ ] Modify the Core Assistant instructoins to give it a better name.
- [x] use `o1-mini` for getting structured response before storing things into
      the database and calling other assistants.

#### Plan Generation

- [x] Integrate Large Language Model (currently using `O series`) for personalized
      plan generation.
  - [ ] Design functions to retrieve necessary user data and preferences for
        LLM prompts.
  - [x] Implement an API interface to interact with LLMs securely.
  - [ ] Cache generated plans for efficiency using Redis or a similar solution.

#### Tracking User Progress

- [ ] Implement tracking mechanisms for user activity and metrics.
  - [ ] Store progress data in the time-series database.
  - [ ] Develop APIs to retrieve and analyze progress data for insights.
- [ ] Ensure LLMs can query progress data to provide feedback and suggestions.

#### Security and Compliance

- [x] Implement encryption for sensitive data at rest and in transit.
  - [x] Use TLS for all API communications.
  - [x] Encrypt sensitive fields in databases (e.g., PII).
- [ ] Apply role-based access control (RBAC) to ensure only authorized users
      access sensitive information.
- [x] Set up logging and monitoring for backend services to detect anomalies.

#### Arch Testing (lol) and Deployment

- [ ] Write unit and integration tests for backend APIs and business logic.
  - [ ] Use tools like Vitest or Jest for testing.
- [x] Set up CI/CD pipelines for deploying backend and frontend services.
  - [x] Use Kubernetes for managing deployments.
  - [ ] Automate database migrations during deployment (No use since we are
        using NoSQL DB).
- [ ] Monitor application performance and errors in production using tools
      like Prometheus and Grafana.

#### Analytics and Insights

- [ ] Implement user analytics to track engagement and app usage.
  - [ ] Store anonymized data for privacy compliance.
  - [ ] Use tools like Google Analytics or Mixpanel for tracking.

#### Documentation

- [ ] Document API endpoints, database schemas, and system architecture.
- [ ] Maintain clear onboarding instructions for future developers.

### Action Items for Integrating Native Health APIs and Ensuring Compliance

#### Native App Development

- [x] Build a **React Native** application to integrate with native APIs
      (HealthKit for iOS, Google Health Connect for Android).
- [x] Implement methods to retrieve data securely from **HealthKit** and
      **Health Connect** APIs.
- [ ] Add functionality to push the retrieved data to the backend
      securely via encrypted communication (Time series DB setup not done).

#### User Consent and Privacy

- [ ] Create a **consent management flow**:
  - [x] Inform users about the specific health data you’ll access.
  - [x] Obtain explicit user consent before accessing health data.
  - [ ] Provide users with an option to revoke permissions anytime.
- [ ] Write a detailed **privacy policy**:
  - [ ] Specify what health data is collected (e.g., weight, activity, nutrition).
  - [ ] Explain how data will be used, stored, and protected.
  - [ ] State how long the data will be retained.
  - [ ] Include instructions for users to view, manage, or delete their data.

#### Compliance with Regulations (MAN I NEED HELP WITH THIS :( )

- [ ] Ensure compliance with **local and international laws**:
  - [ ] HIPAA (United States) for handling healthcare data.
  - [ ] GDPR (European Union) for user data protection and rights.
  - [ ] CCPA (California) for user data rights and transparency.
- [ ] Consult with a **legal expert** to confirm compliance with relevant laws.

#### Data Security

- [x] Implement **data encryption**:
  - [x] Use HTTPS for secure transmission of data (TLS in transit).
  - [x] Use AES encryption (or equivalent) for storing data at rest.
- [x] Secure backend APIs to ensure that only authorized users can upload
      or retrieve health data.

#### User Access and Control

- [ ] Build features to allow users to:
  - [ ] View their stored health data.
  - [ ] Update or correct their data.
  - [ ] Delete their data or revoke consent.
- [ ] Ensure that deleted data is fully removed from both storage and backups.

#### Backend Integration

- [ ] Create a backend to:
  - [ ] Store time-series data for user tracking securely.
  - [ ] Ensure only authorized access to sensitive data.
- [ ] Design a schema for **time-series health data** storage.
- [ ] Enable real-time syncing of user data from the mobile app.

#### Audit and Monitoring

- [ ] Maintain an **audit trail** to log:
  - [ ] When health data is accessed.
  - [ ] By whom the data was accessed.
  - [ ] For what purpose the data was accessed.
- [ ] Periodically review and update security protocols.

#### Testing and Deployment

- [ ] Test the React Native app thoroughly to ensure it complies with all
      API guidelines (HealthKit and Health Connect).
- [ ] Verify encryption and secure communication during data transfer.
- [ ] Conduct security audits to validate compliance with regulations.

#### Tracking Documentation

- [ ] Document all data flows and compliance practices for internal use.
- [ ] Provide clear, user-facing documentation explaining how data is
      handled and protected.
