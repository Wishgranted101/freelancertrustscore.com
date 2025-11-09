// Mock Backend URL (Replace with your actual Firebase/API endpoint)
const API_ENDPOINT = "https://api.freelancertrustscore.com/v1/ratings";

// --- Utility Functions ---

// Function to get the current tab's domain
function getCurrentDomain() {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const url = new URL(tabs[0].url);
            // Simple domain extraction (e.g., from https://www.example.com/path -> example.com)
            const parts = url.hostname.split('.');
            if (parts.length > 2 && parts[0] !== 'www') {
                resolve(parts.slice(parts.length - 2).join('.'));
            } else if (parts.length > 1) {
                resolve(parts.slice(parts.length - 2).join('.'));
            } else {
                resolve(url.hostname);
            }
        });
    });
}

// Mock function to fetch data (replace with actual API call)
async function fetchFTSData(domain) {
    // This is where you would make a secure fetch request to your backend
    // For MVP demonstration, we use mock data
    console.log(`Fetching data for domain: ${domain}`);

    // Mock Data Structure based on the Aggregates Table
    const mockData = {
        "bigcorp.com": {
            total_ratings: 47,
            avg_trust_score: 92,
            avg_payment_reliability: 4.8,
            avg_scope_management: 2.1,
            avg_communication_clarity: 4.1,
            negative_sentiment_count: 17
        },
        "newclient.org": {
            total_ratings: 5,
            avg_trust_score: 75,
            avg_payment_reliability: 3.5,
            avg_scope_management: 4.0,
            avg_communication_clarity: 3.8,
            negative_sentiment_count: 1
        }
    };

    if (mockData[domain]) {
        return mockData[domain];
    } else {
        // Return a structure for a domain with no ratings
        return {
            total_ratings: 0,
            avg_trust_score: "--",
            avg_payment_reliability: "--",
            avg_scope_management: "--",
            avg_communication_clarity: "--",
            negative_sentiment_count: 0
        };
    }
}

// --- Display Functions ---

function updateDisplay(domain, data) {
    document.getElementById('client-domain').textContent = domain;
    document.getElementById('overall-score').textContent = data.avg_trust_score;
    document.getElementById('total-ratings').textContent = data.total_ratings;

    document.getElementById('payment-reliability').textContent = `${data.avg_payment_reliability} / 5.0`;
    document.getElementById('scope-management').textContent = `${data.avg_scope_management} / 5.0`;
    document.getElementById('communication-clarity').textContent = `${data.avg_communication_clarity} / 5.0`;

    const negativeCount = data.negative_sentiment_count;
    const totalRatings = data.total_ratings;

    if (totalRatings > 0 && negativeCount > 0) {
        const percentage = Math.round((negativeCount / totalRatings) * 100);
        document.getElementById('negative-count').textContent = percentage;
        document.getElementById('sentiment-flag').style.display = 'block';
    } else {
        document.getElementById('sentiment-flag').style.display = 'none';
    }
}

// --- Form Submission Handler ---

async function handleSubmitRating(event) {
    event.preventDefault();

    const domain = document.getElementById('client-domain').textContent;
    const payment = document.getElementById('form-payment').value;
    const scope = document.getElementById('form-scope').value;
    const comm = document.getElementById('form-comm').value;
    const sentiment = document.getElementById('form-sentiment').value;
    const messageElement = document.getElementById('form-message');

    // In a real application, you would send this data to your API
    const submissionData = {
        domain: domain,
        payment_reliability: parseInt(payment),
        scope_management: parseInt(scope),
        communication_clarity: parseInt(comm),
        sentiment_flag: parseInt(sentiment)
    };

    console.log("Submitting data:", submissionData);

    // Mock API call success
    messageElement.textContent = "Rating submitted successfully! Thank you for contributing.";
    messageElement.style.color = '#28a745'; // Green for success

    // Optionally, hide the form and refresh the display after a delay
    setTimeout(() => {
        document.getElementById('rating-form').style.display = 'none';
        document.getElementById('toggle-rating-form').textContent = 'Add Your Rating';
        // In a real app, you'd re-fetch the data to show the updated score
        // init(); 
    }, 2000);
}

// --- Initialization ---

async function init() {
    const domain = await getCurrentDomain();
    const data = await fetchFTSData(domain);
    updateDisplay(domain, data);

    // Toggle form visibility
    document.getElementById('toggle-rating-form').addEventListener('click', () => {
        const form = document.getElementById('rating-form');
        const button = document.getElementById('toggle-rating-form');
        if (form.style.display === 'block') {
            form.style.display = 'none';
            button.textContent = 'Add Your Rating';
        } else {
            form.style.display = 'block';
            button.textContent = 'Hide Rating Form';
        }
    });

    // Handle form submission
    document.getElementById('submit-rating').addEventListener('click', handleSubmitRating);
}

document.addEventListener('DOMContentLoaded', init);


