## Summary of Changes:

- **Currency Column Addition:** Added currency columns to the report and project tables to display total project details accurately.

- **Currency Display Enhancement:** Implemented currency display functionality within the project details interface for improved user experience.

- **Annual Target Adjustment:** Modified annual target from a text format to JSONB, enabling users to specify targets and values more flexibly.

- **Annual Target Calculation:** Calculated annual target figures for better presentation on the project details page.

## Next Tasks:

- **Measurement Column Inclusion:** Add a measurement column to accommodate various fields such as percentage of, number of, etc.

- **Report Page Navigation:** Establish a connection between the number of reports page and its corresponding list of reports for easier navigation.

- **Project Contributors Display:** Enhance the display of project contributors by including additional details such as phone numbers, email addresses, etc.

- **Single Report View Creation:** Create a dedicated view for the single report to improve accessibility and viewing experience.

## How should this be manually tested?

- Clone the repository using `git clone https://github.com/ganzafrica-org/project-tracker-system.git`

- Install node packages that the application depends on: `npm i`

- Create a `.env` file in the root directory and add all environment variables required to run the application. The required variables are listed in the `.env.example` file available in root directory of the application.

- create a folder/file for `config` and add configuration of databases info as well

- Start the application development server: `npm run dev`

## Any background context you want to provide?

## Screenshots (if appropriate)
