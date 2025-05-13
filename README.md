## TODO

### Simple Features

- [ ] Add tags to jobs (e.g: in Google, you could be working on "Google Cloud", "Google Ads", "Google Search", etc.)
  - JobTag model, with:
    - [ ] Name
- [ ] Add to jobs
  - [ ] WorkplaceLocation (e.g: "Remote", "On-site", "Hybrid")
  - [ ] EmploymentType (e.g: "Full-time", "Part-time", "Internship", "Contractor")
  - [ ] Country
  - [ ] City
  - [ ] Zip Code
  - [ ] SalaryMin
  - [ ] SalaryMax
  - [ ] JobStatus (e.g: "Open", "Closed")
- [ ] Add job application status (e.g: "Applied", "Interviewing", "Hired", "Rejected")
  - [ ] Update job application status

### Complex Features
- [ ] Add job resume upload with Amazon S3 or Google Cloud Storage
- [ ] Send email to the user when the job application is
  - [ ] Created
  - [ ] Status is updated (Rejected, Accepted)
- [ ] Send email to user when the job they've applied has been updated
  - [ ] Status is updated (Closed -> Should only be sent if the user has not been accepted, Reopened -> Should only be sent if the user has not been accepted)