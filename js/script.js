/**
 * Class responsible for generating and managing QR code print layouts on A4 sheets.
 */
class QRPrintGenerator {
  /**
   * @param {string} containerId - DOM ID of the A4 sheet container element.
   * @param {string} selectId - DOM ID of the dropdown selector for item count.
   * @param {string} printButtonId - DOM ID of the print button.
   * @param {string} fileInputId - DOM ID of the file input element.
   */
  constructor(containerId, selectId, printButtonId, fileInputId) {
    this.imagePath = null // No initial image until user uploads one
    this.container = document.getElementById(containerId)
    this.countSelect = document.getElementById(selectId)
    this.printBtn = document.getElementById(printButtonId)
    this.fileInput = document.getElementById(fileInputId)

    // Initialize event listeners and first render
    this.initEvents()
    this.generate()
  }

  /**
   * Binds DOM events to class methods.
   */
  initEvents() {
    this.countSelect.addEventListener('change', () => this.generate())
    this.printBtn.addEventListener('click', () => window.print())

    if (this.fileInput) {
      this.fileInput.addEventListener('change', event => {
        const file = event.target.files[0]
        if (file) {
          // Convert uploaded file into a usable object URL
          this.imagePath = URL.createObjectURL(file)
          this.generate()
        }
      })
    }
  }

  /**
   * Dynamically adjusts CSS Grid column count and row heights based on density.
   * @param {number} totalCount - Total number of items to render.
   */
  updateGridLayout(totalCount) {
    if (totalCount <= 20) {
      this.container.style.gridTemplateColumns = 'repeat(4, 1fr)'
      this.container.style.gridAutoRows = '45mm'
    } else if (totalCount <= 30) {
      this.container.style.gridTemplateColumns = 'repeat(5, 1fr)'
      this.container.style.gridAutoRows = '38mm'
    } else if (totalCount <= 40) {
      this.container.style.gridTemplateColumns = 'repeat(6, 1fr)'
      this.container.style.gridAutoRows = '32mm'
    } else if (totalCount <= 100) {
      this.container.style.gridTemplateColumns = 'repeat(10, 1fr)'
      this.container.style.gridAutoRows = '22mm'
    } else {
      // High-density layout for 400 codes
      this.container.style.gridTemplateColumns = 'repeat(20, 1fr)'
      this.container.style.gridAutoRows = '11mm'
    }
  }

  /**
   * Generates QR code duplicates and injects them into the DOM container.
   */
  generate() {
    // Clear existing elements inside the container
    this.container.innerHTML = ''

    // If no image is selected yet, prompt user inside the sheet
    if (!this.imagePath) {
      const placeholder = document.createElement('div')
      placeholder.className = 'upload-placeholder'
      placeholder.textContent = 'Please upload a QR Code image to generate grid.'
      this.container.appendChild(placeholder)
      return
    }

    // Get selected amount from dropdown
    const totalDuplicates = parseInt(this.countSelect.value, 10)

    // Apply grid sizing rules
    this.updateGridLayout(totalDuplicates)

    // Loop to duplicate the single QR code path into multiple cards
    for (let i = 1; i <= totalDuplicates; i++) {
      const card = document.createElement('div')
      card.className = 'qr-card'

      const img = document.createElement('img')
      img.src = this.imagePath
      img.alt = `QR Code duplicate #${i}`

      card.appendChild(img)
      this.container.appendChild(card)
    }
  }
}

// --- Initialization on page load ---
window.addEventListener('DOMContentLoaded', () => {
new QRPrintGenerator('qrContainer', 'countSelect', 'printBtn', 'fileInput')
})
