// Set data-endpoint on #enquiry-form to the existing form service's HTTPS submission URL.
const enquiryForm = document.querySelector('#enquiry-form');
const enquiryStatus = document.querySelector('#enquiry-status');
const enquiryButton = enquiryForm.querySelector('button[type="submit"]');
const enquiryEndpoint = enquiryForm.dataset.endpoint.trim();
if (enquiryEndpoint) {
  document.querySelector('#form-notice').textContent = 'Required fields are marked *. Your details will be sent to our enquiry service so the showroom can respond.';
}
enquiryForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!enquiryForm.reportValidity()) return;
  if (!enquiryForm.elements.name.value.trim()) {
    enquiryStatus.textContent = 'Please enter your full name.';
    enquiryForm.elements.name.focus();
    return;
  }
  if (!enquiryEndpoint) {
    enquiryStatus.textContent = 'Online submission is not connected yet. Your details have not been sent. Please call 088868 22791 to enquire.';
    enquiryStatus.focus();
    return;
  }
  enquiryButton.disabled = true;
  enquiryButton.textContent = 'Sending enquiry...';
  enquiryStatus.textContent = '';
  try {
    const response = await fetch(enquiryEndpoint, {
      method: 'POST',
      body: new FormData(enquiryForm),
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('Submission failed');
    enquiryForm.reset();
    enquiryStatus.textContent = 'Thank you. Your enquiry has been submitted.';
  } catch {
    enquiryStatus.textContent = 'We could not confirm your submission. Your details are still here so you can try again, or call 088868 22791.';
  } finally {
    enquiryButton.disabled = false;
    enquiryButton.textContent = 'Submit enquiry \u2192';
    enquiryStatus.focus();
  }
});
