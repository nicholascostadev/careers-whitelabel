## TODO

### Simple Features

- [ ] Add tags to jobs (e.g: in Google, you could be working on "Google Cloud", "Google Ads", "Google Search", etc.)
- [x] JobTag model, with:
  - [x] Name
  - [x] OrganizationId
  - [x] JobId
- [x] Add to jobs
  - [x] WorkplaceLocation (e.g: "Remote", "On-site", "Hybrid")
  - [x] EmploymentType (e.g: "Full-time", "Part-time", "Internship", "Contractor")
  - [x] Country
  - [x] City
  - [x] Zip Code
  - [x] SalaryMin
  - [x] SalaryMax
  - [x] JobStatus (e.g: "Open", "Closed")
- [ ] Add job application status (e.g: "Applied", "Interviewing", "Hired", "Rejected")
  - [ ] Update job application status

### Complex Features
- [ ] Add job resume upload with Amazon S3 or Google Cloud Storage
- [ ] Send email to the user when the job application is
  - [ ] Created
  - [ ] Status is updated (Rejected, Accepted)
- [ ] Send email to user when the job they've applied has been updated
  - [ ] Status is updated (Closed -> Should only be sent if the user has not been accepted, Reopened -> Should only be sent if the user has not been accepted)