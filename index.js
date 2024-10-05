// Import the Elasticsearch client
const { Client } = require('@elastic/elasticsearch');

// Initialize the Elasticsearch client
const client = new Client({ node: 'http://localhost:9200' });

// Employee data
const employees = [
    {
        employee_id: "E02002",
        full_name: "Kai Le",
        job_title: "Controls Engineer",
        department: "Engineering",
        business_unit: "Manufacturing",
        gender: "Male",
        ethnicity: "Asian",
        age: 47,
        hire_date: "2022-02-05",
        annual_salary: 92368
    },
    {
        employee_id: "E02003",
        full_name: "Robert Patel",
        job_title: "Analyst",
        department: "Sales",
        business_unit: "Corporate",
        gender: "Male",
        ethnicity: "Asian",
        age: 58,
        hire_date: "2013-10-23",
        annual_salary: 45703
    },
    // Add other employees here
];

// Function to index the employee data
async function indexEmployees() {
    const body = employees.flatMap(doc => [
        { index: { _index: 'employees', _id: doc.employee_id } },
        doc
    ]);

    try {
        const { body: bulkResponse } = await client.bulk({ refresh: true, body });

        if (bulkResponse.errors) {
            console.log('Errors occurred during indexing');
            const erroredDocuments = bulkResponse.items.filter(item => item.index && item.index.error);
            console.log(erroredDocuments);
        } else {
            console.log('Successfully indexed employees');
        }
    } catch (error) {
        console.error('Error indexing employees:', error);
    }
}

// Run the indexEmployees function
indexEmployees();

// Function to search for employees by department
async function searchEmployeeByDepartment(department) {
    try {
        const { body } = await client.search({
            index: 'employees',
            body: {
                query: {
                    match: { department: department }
                }
            }
        });

        console.log('Search results:', body.hits.hits);
    } catch (error) {
        console.error('Error searching employees:', error);
    }
}

// Example usage
searchEmployeeByDepartment('IT');
