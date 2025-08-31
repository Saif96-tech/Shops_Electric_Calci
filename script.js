document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    const shareBtn = document.getElementById('shareBtn');
    const resultsSection = document.getElementById('resultsSection');
    const validationSection = document.getElementById('validationSection');
    const inputs = document.querySelectorAll('input[required]');
    
    // Add validation to required inputs
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });
    
    function validateInput(input) {
        const errorMessage = input.parentElement.querySelector('.error-message');
        if (!input.value) {
            errorMessage.style.display = 'block';
            input.style.borderColor = '#e74c3c';
            return false;
        } else {
            errorMessage.style.display = 'none';
            input.style.borderColor = '#ddd';
            return true;
        }
    }
    
    function validateForm() {
        let isValid = true;
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });
        
        // Check if at least two shops have readings
        const shop1Last = parseFloat(document.getElementById('shop1Last').value) || 0;
        const shop1Current = parseFloat(document.getElementById('shop1Current').value) || 0;
        const shop2Last = parseFloat(document.getElementById('shop2Last').value) || 0;
        const shop2Current = parseFloat(document.getElementById('shop2Current').value) || 0;
        const shop3Last = parseFloat(document.getElementById('shop3Last').value) || 0;
        const shop3Current = parseFloat(document.getElementById('shop3Current').value) || 0;
        
        const shop1Valid = shop1Current >= shop1Last;
        const shop2Valid = shop2Current >= shop2Last;
        const shop3Valid = shop3Current >= shop3Last;
        
        const validShops = [shop1Valid, shop2Valid, shop3Valid].filter(Boolean).length;
        
        if (validShops < 2) {
            alert('Please provide valid meter readings for at least two shops.');
            isValid = false;
        }
        
        return isValid;
    }
    
    calculateBtn.addEventListener('click', function() {
        if (!validateForm()) return;
        
        // Get main bill inputs
        const totalAmount = parseFloat(document.getElementById('totalAmount').value) || 0;
        const totalUnits = parseFloat(document.getElementById('totalUnits').value) || 0;
        const perUnitCharge = parseFloat(document.getElementById('perUnitCharge').value) || 0;
        
        // Get shop readings
        const shop1Last = parseFloat(document.getElementById('shop1Last').value) || 0;
        const shop1Current = parseFloat(document.getElementById('shop1Current').value) || 0;
        const shop2Last = parseFloat(document.getElementById('shop2Last').value) || 0;
        const shop2Current = parseFloat(document.getElementById('shop2Current').value) || 0;
        const shop3Last = parseFloat(document.getElementById('shop3Last').value) || 0;
        const shop3Current = parseFloat(document.getElementById('shop3Current').value) || 0;
        
        // Calculate shop units
        const shop1Units = Math.max(0, shop1Current - shop1Last);
        const shop2Units = Math.max(0, shop2Current - shop2Last);
        const shop3Units = Math.max(0, shop3Current - shop3Last);
        
        // Calculate total units from shops
        const totalCalculatedUnits = shop1Units + shop2Units + shop3Units;
        
        // Calculate reading difference
        const readingDifference = totalCalculatedUnits - totalUnits;
        
        // Calculate load charges
        const totalUnitCharges = totalUnits * perUnitCharge;
        const totalLoadCharges = totalAmount - totalUnitCharges;
        
        // Calculate percentage of units for each shop
        const shop1Percent = totalCalculatedUnits > 0 ? shop1Units / totalCalculatedUnits : 0;
        const shop2Percent = totalCalculatedUnits > 0 ? shop2Units / totalCalculatedUnits : 0;
        const shop3Percent = totalCalculatedUnits > 0 ? shop3Units / totalCalculatedUnits : 0;
        
        // Calculate unit charges for each shop
        const shop1UnitCharges = shop1Units * perUnitCharge;
        const shop2UnitCharges = shop2Units * perUnitCharge;
        const shop3UnitCharges = shop3Units * perUnitCharge;
        
        // Calculate load charges for each shop (proportional to unit usage)
        const shop1LoadCharges = shop1Percent * totalLoadCharges;
        const shop2LoadCharges = shop2Percent * totalLoadCharges;
        const shop3LoadCharges = shop3Percent * totalLoadCharges;
        
        // Calculate difference amount
        const differenceAmount = Math.abs(readingDifference) * perUnitCharge;
        
        // Calculate total for each shop
        const shop1Total = shop1UnitCharges + shop1LoadCharges;
        const shop2Total = shop2UnitCharges + shop2LoadCharges;
        const shop3Total = shop3UnitCharges + shop3LoadCharges;
        
        // Calculate sum of all shop totals
        const sumShopTotals = shop1Total + shop2Total + shop3Total;
        
        // Calculate grand total (shops + difference amount)
        const grandTotal = sumShopTotals + (readingDifference > 0 ? differenceAmount : -differenceAmount);
        
        // Validate if grand total equals total bill amount
        const difference = Math.abs(grandTotal - totalAmount);
        let validationDetails = "";
        
        if (difference < 0.01) { // Account for floating point precision
            validationDetails = `Validation Successful: Grand Total (₹${grandTotal.toFixed(2)}) equals Total Bill Amount (₹${totalAmount.toFixed(2)})`;
            validationSection.className = "validation";
        } else {
            validationDetails = `Calculation Error: Grand Total (₹${grandTotal.toFixed(2)}) does not match Total Bill Amount (₹${totalAmount.toFixed(2)})`;
            validationSection.className = "validation validation-error";
        }
        
        // Update UI with results
        document.getElementById('totalLoad').textContent = `₹${totalLoadCharges.toFixed(2)}`;
        document.getElementById('totalCalculatedUnits').textContent = `${totalCalculatedUnits.toFixed(2)} kWh`;
        
        // Format reading difference with color for negative values
        const readingDifferenceElem = document.getElementById('readingDifference');
        readingDifferenceElem.textContent = `${readingDifference.toFixed(2)} kWh`;
        if (readingDifference < 0) {
            readingDifferenceElem.classList.add('negative-difference');
        } else {
            readingDifferenceElem.classList.remove('negative-difference');
        }
        
        // Shop 1
        document.getElementById('shop1Units').textContent = `${shop1Units.toFixed(2)} kWh`;
        document.getElementById('shop1UnitCharges').textContent = `₹${shop1UnitCharges.toFixed(2)}`;
        document.getElementById('shop1Load').textContent = `₹${shop1LoadCharges.toFixed(2)}`;
        document.getElementById('shop1Total').textContent = `₹${shop1Total.toFixed(2)}`;
        
        // Shop 2
        document.getElementById('shop2Units').textContent = `${shop2Units.toFixed(2)} kWh`;
        document.getElementById('shop2UnitCharges').textContent = `₹${shop2UnitCharges.toFixed(2)}`;
        document.getElementById('shop2Load').textContent = `₹${shop2LoadCharges.toFixed(2)}`;
        document.getElementById('shop2Total').textContent = `₹${shop2Total.toFixed(2)}`;
        
        // Shop 3
        document.getElementById('shop3Units').textContent = `${shop3Units.toFixed(2)} kWh`;
        document.getElementById('shop3UnitCharges').textContent = `₹${shop3UnitCharges.toFixed(2)}`;
        document.getElementById('shop3Load').textContent = `₹${shop3LoadCharges.toFixed(2)}`;
        document.getElementById('shop3Total').textContent = `₹${shop3Total.toFixed(2)}`;
        
        // Update summary
        document.getElementById('summaryTotal').textContent = `₹${totalAmount.toFixed(2)}`;
        document.getElementById('summaryUnitCharges').textContent = `₹${totalUnitCharges.toFixed(2)}`;
        document.getElementById('summaryLoad').textContent = `₹${totalLoadCharges.toFixed(2)}`;
        document.getElementById('summaryExtra').textContent = `₹${differenceAmount.toFixed(2)}`;
        
        // Update shop totals in summary
        document.getElementById('summaryShop1').textContent = `₹${shop1Total.toFixed(2)}`;
        document.getElementById('summaryShop2').textContent = `₹${shop2Total.toFixed(2)}`;
        document.getElementById('summaryShop3').textContent = `₹${shop3Total.toFixed(2)}`;
        document.getElementById('summaryShops').textContent = `₹${sumShopTotals.toFixed(2)}`;
        document.getElementById('summaryDifferenceAmount').textContent = `₹${differenceAmount.toFixed(2)}`;
        document.getElementById('summaryGrandTotal').textContent = `₹${grandTotal.toFixed(2)}`;
        
        // Update validation details
        document.getElementById('validationDetails').textContent = validationDetails;
        
        // Show results section
        resultsSection.style.display = 'block';
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    shareBtn.addEventListener('click', function() {
        if (resultsSection.style.display !== 'block') {
            alert('Please calculate the bill first before sharing.');
            return;
        }
        
        // Create PDF using html2canvas and jsPDF
        html2canvas(resultsSection).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;
            
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            // Add more pages if needed
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            // Save the PDF
            pdf.save('Electricity_Bill_Calculation.pdf');
        });
    });
});