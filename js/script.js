// Use this URL to fetch NASA APOD JSON data.
const apodData = 'https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json';

// Wait for the DOM to load before adding event listeners.
document.addEventListener('DOMContentLoaded', function() {
  const getImageBtn = document.getElementById('getImageBtn');
  const gallery = document.getElementById('gallery');
  
  getImageBtn.addEventListener('click', function() {
    // Show a loading message.
    gallery.innerHTML = '<p>Loading space images...</p>';
    fetchApodData().then(data => {
      if (data === null) {
        gallery.innerHTML = '<p>Sorry, could not load space images. Please try again later.</p>';
      } 
      else {
        parseApodData(data);
      }
    });
  });
});

// Function to fetch Nasa APOD data.
async function fetchApodData() {
  try {
    const response = await fetch(apodData);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

// Take data, and add it to the image gallery.
function parseApodData(data) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  
  if (!data || data.length === 0) {
    gallery.innerHTML = '<p>No space images found.</p>';
    return;
  }
  
  data.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'gallery-item';
    
    // Add images to the gallery.
    if (item.media_type === 'image') {
      const img = document.createElement('img');
      img.src = item.url;
      img.alt = item.title;
      img.className = 'apod-image';
      itemDiv.appendChild(img);
    } 
    // Add videos to the gallery.
    else if (item.media_type === 'video') {
      
      if (item.thumbnail_url) {
        const img = document.createElement('img');
        img.src = item.thumbnail_url;
        img.alt = item.title + ' (video thumbnail)';
        img.className = 'apod-image';
        itemDiv.appendChild(img);
      } 
      
      else {
        const link = document.createElement('a');
        link.href = item.url;
        link.target = '_blank';
        link.textContent = 'Watch Video';
        itemDiv.appendChild(link);
      }
    }
    
    // Add title and date.
    const title = document.createElement('h3');
    title.textContent = item.title;
    itemDiv.appendChild(title);
    
    const date = document.createElement('p');
    date.textContent = item.date;
    itemDiv.appendChild(date);
    gallery.appendChild(itemDiv);
  });
}

