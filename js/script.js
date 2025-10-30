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
      } else {
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

    // Add click event to open modal
    itemDiv.addEventListener('click', function() {
      showModal(item);
    });

    gallery.appendChild(itemDiv);
  });


// Build the modal content (media, title, date, explanation, close button)
function buildModal(item, onClose) {
  const modalBox = document.createElement('div');
  modalBox.className = 'modal-box';

  // Close button
  const closeBtn = document.createElement('span');
  closeBtn.className = 'modal-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.title = 'Close';
  closeBtn.onclick = onClose;

  // Add large image or video
  let mediaElem;
  if (item.media_type === 'image') {
    mediaElem = document.createElement('img');
    mediaElem.src = item.hdurl || item.url;
    mediaElem.alt = item.title;
    mediaElem.className = 'modal-image';
  } else if (item.media_type === 'video') {
    if (item.url.includes('youtube.com') || item.url.includes('youtu.be')) {
      mediaElem = document.createElement('iframe');
      mediaElem.src = item.url;
      mediaElem.width = '100%';
      mediaElem.height = '400';
      mediaElem.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      mediaElem.allowFullscreen = true;
      mediaElem.className = 'modal-video';
    } else {
      mediaElem = document.createElement('a');
      mediaElem.href = item.url;
      mediaElem.target = '_blank';
      mediaElem.textContent = 'Watch Video';
    }
  }

  // Title
  const modalTitle = document.createElement('h2');
  modalTitle.textContent = item.title;

  // Date
  const modalDate = document.createElement('p');
  modalDate.className = 'modal-date';
  modalDate.textContent = item.date;

  // Explanation
  const modalExplanation = document.createElement('p');
  modalExplanation.className = 'modal-explanation';
  modalExplanation.textContent = item.explanation || 'No explanation available.';

  // Add everything to modal box
  modalBox.appendChild(closeBtn);
  if (mediaElem) modalBox.appendChild(mediaElem);
  modalBox.appendChild(modalTitle);
  modalBox.appendChild(modalDate);
  modalBox.appendChild(modalExplanation);

  return modalBox;
}

// Show the modal (handles adding/removing modalBg, open/close logic)
function showModal(item) {
  
  // Create modal background
  const modalBg = document.createElement('div');
  modalBg.className = 'modal-bg';

  // Build modal content
  const modalBox = buildModal(item, function() {
    document.body.removeChild(modalBg);
  });
  modalBg.appendChild(modalBox);

  // Add modal to the page
  document.body.appendChild(modalBg);

  // Close modal when clicking outside the box
  modalBg.addEventListener('click', function(e) {
    if (e.target === modalBg) {
      document.body.removeChild(modalBg);
    }
  });
}
}