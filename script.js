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
        
        // Show results section first
        resultsSection.style.display = 'block';
        
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
        const readingDifference = totalUnits -totalCalculatedUnits;
        
        // Calculate load charges
        const totalUnitCharges = totalUnits * perUnitCharge;
        const totalLoadCharges = totalAmount - totalUnitCharges;
        
        // Calculate percentage of units for each shop
        const shop1Percent = totalUnits > 0 ? shop1Units / totalUnits : 0;
        const shop2Percent = totalUnits > 0 ? shop2Units / totalUnits : 0;
        const shop3Percent = totalUnits > 0 ? shop3Units / totalUnits : 0;
        
        // Calculate unit charges for each shop
        const shop1UnitCharges = shop1Units * perUnitCharge;
        const shop2UnitCharges = shop2Units * perUnitCharge;
        const shop3UnitCharges = shop3Units * perUnitCharge;
        
        // Calculate load charges for each shop (proportional to unit usage)
        const shop1LoadCharges = shop1Percent * totalLoadCharges;
        const shop2LoadCharges = shop2Percent * totalLoadCharges;
        const shop3LoadCharges = shop3Percent * totalLoadCharges;
        
        // Calculate difference amount
        const differenceAmount = Math.abs(readingDifference) * perUnitCharge + (readingDifference / totalUnits) * totalLoadCharges;
        // Calculate total for each shop
        const shop1Total = shop1UnitCharges + shop1LoadCharges;
        const shop2Total = shop2UnitCharges + shop2LoadCharges;
        const shop3Total = shop3UnitCharges + shop3LoadCharges;
        
        // Calculate sum of all shop totals
        const sumShopTotals = shop1Total + shop2Total + shop3Total;
        
        // Calculate grand total (shops + difference amount)
        const grandTotal = sumShopTotals + (readingDifference > 0 ? differenceAmount : differenceAmount);
        
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
        
        // Update bill header details
        const currentDate = new Date();
        const dateStr = currentDate.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('billDate').textContent = dateStr;
        document.getElementById('summaryUnits').textContent = `${totalUnits.toFixed(0)} kWh`;
        document.getElementById('summaryAmount').textContent = `₹${totalAmount.toFixed(2)}`;
        document.getElementById('summaryLoad').textContent = `₹${totalLoadCharges.toFixed(2)}`;

        // Update Shop 1 row
        document.getElementById('shop1LastReading').textContent = shop1Last;
        document.getElementById('shop1CurrReading').textContent = shop1Current;
        document.getElementById('shop1UnitsTable').textContent = shop1Units.toFixed(0);
        document.getElementById('shop1LoadPercent').textContent = `${(shop1Percent * 100).toFixed(1)}%`;
        document.getElementById('shop1LoadAmount').textContent = `₹${shop1LoadCharges.toFixed(2)}`;
        document.getElementById('shop1TotalAmount').textContent = `₹${shop1Total.toFixed(2)}`;

        // Update Shop 2 row
        document.getElementById('shop2LastReading').textContent = shop2Last;
        document.getElementById('shop2CurrReading').textContent = shop2Current;
        document.getElementById('shop2UnitsTable').textContent = shop2Units.toFixed(0);
        document.getElementById('shop2LoadPercent').textContent = `${(shop2Percent * 100).toFixed(1)}%`;
        document.getElementById('shop2LoadAmount').textContent = `₹${shop2LoadCharges.toFixed(2)}`;
        document.getElementById('shop2TotalAmount').textContent = `₹${shop2Total.toFixed(2)}`;

        // Update Shop 3 row
        document.getElementById('shop3LastReading').textContent = shop3Last;
        document.getElementById('shop3CurrReading').textContent = shop3Current;
        document.getElementById('shop3UnitsTable').textContent = shop3Units.toFixed(0);
        document.getElementById('shop3LoadPercent').textContent = `${(shop3Percent * 100).toFixed(1)}%`;
        document.getElementById('shop3LoadAmount').textContent = `₹${shop3LoadCharges.toFixed(2)}`;
        document.getElementById('shop3TotalAmount').textContent = `₹${shop3Total.toFixed(2)}`;

        // Update Difference row
        document.getElementById('diffUnits').textContent = readingDifference.toFixed(0);
        const diffLoadPercent = (readingDifference / totalUnits) * 100;
        document.getElementById('diffLoadPercent').textContent = `${diffLoadPercent.toFixed(1)}%`;
        document.getElementById('diffLoadAmount').textContent = `₹${(readingDifference / totalUnits * totalLoadCharges).toFixed(2)}`;
        document.getElementById('diffTotalAmount').textContent = `₹${differenceAmount.toFixed(2)}`;

        // Update Grand Total
        document.getElementById('grandTotalAmount').textContent = `₹${totalAmount.toFixed(2)}`;

        // Update validation details
        document.getElementById('validationDetails').textContent = validationDetails;
        
        // Show results section and share button
        resultsSection.style.display = 'block';
        document.querySelector('.summary').style.display = 'block';
        shareBtn.style.display = 'block';
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    shareBtn.addEventListener('click', async function() {
        if (resultsSection.style.display !== 'block') {
            alert('Please calculate the bill first before sharing.');
            return;
        }

        // Create image using html2canvas
        try {
            const canvas = await html2canvas(document.querySelector('.summary'));
            const imgData = canvas.toDataURL('image/png');
            
            // Create a temporary link element
            const link = document.createElement('a');
            link.download = 'electricity-bill-summary.png';
            link.href = imgData;
            
            // Trigger the download
            link.click();
        } catch (error) {
            console.error('Error generating image:', error);
            alert('Error generating image for sharing. Please try again.');
        }
    });
});