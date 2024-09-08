const form = document.getElementById('resumeForm') as HTMLFormElement;
const nameInput = document.getElementById('name') as HTMLInputElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const phoneInput = document.getElementById('phone') as HTMLInputElement;
const profilePictureInput = document.getElementById('profilePicture') as HTMLInputElement;
const educationInput = document.getElementById('education') as HTMLInputElement;
const experienceInput = document.getElementById('experience') as HTMLInputElement;
const skillsInput = document.getElementById('skills') as HTMLInputElement;

const shareLink = document.getElementById('share-link') as HTMLDivElement;
const resumeUrl = document.getElementById('resume-url') as HTMLInputElement;
const copyLinkButton = document.getElementById('copy-link') as HTMLButtonElement;
const downloadButton = document.getElementById('download-resume') as HTMLButtonElement;

// Get resume display elements
const resumeSection = document.getElementById('resume') as HTMLElement;
const displayName = document.getElementById('displayName') as HTMLElement;
const displayEmail = document.getElementById('displayEmail') as HTMLElement;
const displayPhone = document.getElementById('displayPhone') as HTMLElement;
const displayProfilePicture = document.getElementById('displayProfilePicture') as HTMLImageElement;
const displayEducation = document.querySelector('#displayEducation p') as HTMLElement;
const displayExperience = document.querySelector('#displayExperience p') as HTMLElement;
const displaySkills = document.querySelector('#displaySkills ul') as HTMLElement;

// Add event listener to form submission
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the form from submitting traditionally

    // Capture the input values
    const name = nameInput.value;
    const email = emailInput.value;
    const phone = phoneInput.value;
    const profilePicture = profilePictureInput.value;
    const education = educationInput.value;
    const experience = experienceInput.value;
    const skills = skillsInput.value.split('&').map(skill => skill.trim());

    // Display the input data in the resume section
    displayName.textContent = `${name}`;
    displayEmail.textContent = `Email ${email}`;
    displayPhone.textContent = `Phone No: ${phone}`;
    
    if (profilePicture) {
        displayProfilePicture.src = profilePicture;
        displayProfilePicture.style.display = 'block';
    } else {
        displayProfilePicture.style.display = 'none';
    }

    
    displayEducation.textContent = education;
    displayExperience.textContent = experience;

    // Clear the skills list and add new skills
    displaySkills.innerHTML = ''; 
    skills.forEach(skill => {
        const li = document.createElement('li');
        li.textContent = skill;
        displaySkills.appendChild(li);
    });

    // Show the resume section
    resumeSection.style.display = 'block';
});


function generateEditableSection(title: string, content: string): string {
  return `
    <div class="editable-section">
      <h2>${title}</h2>
      <p class="editable-content" contenteditable="false">${content}</p>
      <div class="button-group">
        <button class="edit-button">Edit</button>
        <button class="save-button hidden">Save</button>
      </div>
    </div>
  `;
}

function generateEditableListSection(title: string, items: string[]): string {
  const listItems = items.map(item => `<li>${item.trim()}</li>`).join('');
  return `
    <div class="editable-section">
      <h2>${title}</h2>
      <ul class="editable-content" contenteditable="false">
        ${listItems}
      </ul>
      <div class="button-group">
        <button class="edit-button">Edit</button>
        <button class="save-button hidden">Save</button>
      </div>
    </div>
  `;
}

function generatePersonalInfoSectionWithEdit(name: string, email: string, phone: string, profilePicSrc?: string): string {
  let imgHtml = '';
  if (profilePicSrc) {
    imgHtml = `
      <img src="${profilePicSrc}" alt="Profile Picture" id="profile-pic-output" />
      <div class="button-group">
        <button class="edit-profile-pic-button">Edit Picture</button>
      </div>
    `;
  }

  return `
    <div class="editable-section" id="personal-info-section">
      <h2>Personal Information</h2>
      ${imgHtml}
      <p class="editable-content" contenteditable="false"><strong>Name:</strong> ${name}</p>
      <p class="editable-content" contenteditable="false"><strong>Email:</strong> ${email}</p>
      <p class="editable-content" contenteditable="false"><strong>Phone:</strong> ${phone}</p>
      <div class="button-group">
        <button class="edit-button">Edit</button>
        <button class="save-button hidden">Save</button>
      </div>
    </div>
  `;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = (document.getElementById('name') as HTMLInputElement).value;
  const email = (document.getElementById('email') as HTMLInputElement).value;
  const phone = (document.getElementById('phone') as HTMLInputElement).value;
  const education = (document.getElementById('education') as HTMLInputElement).value;
  let workExperience = (document.getElementById('work-experience') as HTMLTextAreaElement).value;
  const skills = (document.getElementById('skills') as HTMLInputElement).value.split(',');
  const profilePicInput = document.getElementById('profile-pic') as HTMLInputElement;
  const profilePicFile = profilePicInput.files?.[0];

  const handleProfilePic = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result as string);
      };
      reader.onerror = function () {
        reject('Error reading profile picture.');
      };
      reader.readAsDataURL(file);
    });
  };

  const populateResume = (profilePicSrc?: string) => {
    nameInput.innerHTML = generatePersonalInfoSectionWithEdit(name, email, phone, profilePicSrc);
    educationInput.innerHTML = generateEditableSection('Education', education);
    workExperience = generateEditableSection('Work Experience', workExperience);
    skillsInput.innerHTML = generateEditableListSection('Skills', skills);

    // resumeOutput.classList.remove('hidden');

    const uniqueUrl = `${window.location.origin}/resume`;
    resumeUrl.value = uniqueUrl;
    shareLink.classList.remove('hidden');
    
    form.reset();
  };

  if (profilePicFile) {
    handleProfilePic(profilePicFile).then((profilePicSrc) => {
      populateResume(profilePicSrc);
    }).catch((error) => {
      console.error(error);
      populateResume();
    });
  } else {
    populateResume();
  }
});

function toggleEditSave(button: HTMLButtonElement, saveButton: HTMLButtonElement, contentElement: HTMLElement) {
  if (button.textContent === 'Edit') {
    contentElement.setAttribute('contenteditable', 'true');
    contentElement.focus();
    button.classList.add('hidden');
    saveButton.classList.remove('hidden');
  }
}

function saveContent(button: HTMLButtonElement, editButton: HTMLButtonElement, contentElement: HTMLElement) {
  if (button.textContent === 'Save') {
    contentElement.setAttribute('contenteditable', 'false');
    button.classList.add('hidden');
    editButton.classList.remove('hidden');
  }
}

function downloadResume() {
//   const resumeHtml = resumeOutput.innerHTML;
  const originalHtml = document.documentElement.innerHTML;
//   document.documentElement.innerHTML = resumeHtml;
  window.print();
  document.documentElement.innerHTML = originalHtml;
}

document.addEventListener('click', function (event) {
  const target = event.target as HTMLElement;

  if (target.classList.contains('edit-button')) {
    const button = target as HTMLButtonElement;
    const parentSection = button.closest('.editable-section');
    if (parentSection) {
      const saveButton = parentSection.querySelector('.save-button') as HTMLButtonElement;
      const contentElement = parentSection.querySelector('.editable-content') as HTMLElement;
      if (saveButton && contentElement) {
        toggleEditSave(button, saveButton, contentElement);
      }
    }
  }

  if (target.classList.contains('save-button')) {
    const button = target as HTMLButtonElement;
    const parentSection = button.closest('.editable-section');
    if (parentSection) {
      const editButton = parentSection.querySelector('.edit-button') as HTMLButtonElement;
      const contentElement = parentSection.querySelector('.editable-content') as HTMLElement;
      if (editButton && contentElement) {
        saveContent(button, editButton, contentElement);
      }
    }
  }

  if (target.classList.contains('edit-profile-pic-button')) {
    const button = target as HTMLButtonElement;
    const parentSection = button.closest('.editable-section');
    if (parentSection) {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.onchange = (e: Event) => {
        const input = e.target as HTMLInputElement;
        if (input.files && input.files[0]) {
          const file = input.files[0];
          const reader = new FileReader();
          reader.onload = function () {
            const imgElement = parentSection.querySelector('#profile-pic-output') as HTMLImageElement;
            if (imgElement) {
              imgElement.src = reader.result as string;
            }
          };
          reader.readAsDataURL(file);
        }
      };
      fileInput.click();
    }
  }

  if (target.id === 'copy-link') {
    resumeUrl.select();
    document.execCommand('copy');
  }

  if (target.id === 'download-resume') {
    downloadResume();
  }
});



  