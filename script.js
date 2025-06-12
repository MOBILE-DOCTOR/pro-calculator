document.addEventListener('DOMContentLoaded', function() {
    // Calculator Mode Selector
    const calculatorModeSelect = document.getElementById('calculator-mode');
    const calculatorSections = document.querySelectorAll('.calculator');

    // Store references to setup functions for each calculator mode
    const calculatorSetups = {
        'standard': setupStandardCalculator,
        'scientific': setupScientificCalculator,
        'graphing': setupGraphingCalculator,
        'currency': setupCurrencyConverter,
        'unit': setupUnitConverter,
        'financial': setupFinancialCalculators,
        'printing': setupPrintingCalculator,
        'online': setupOnlineCalculators
    };

    calculatorModeSelect.addEventListener('change', function() {
        const selectedMode = this.value;

        // Hide all calculator sections
        calculatorSections.forEach(section => {
            section.classList.remove('display-block');
        });

        // Show the selected calculator section
        const targetCalculator = document.getElementById(`${selectedMode}-calculator`);
        if (targetCalculator) {
            targetCalculator.classList.add('display-block');
        } else {
            console.error(`Could not find element with ID: ${selectedMode}-calculator`); // Error log
        }


        // Reset and re-setup the selected calculator
        resetCalculators(); // This clears all displays and specific calculator states
        if (calculatorSetups[selectedMode]) {
            calculatorSetups[selectedMode](); // Call the setup function for the active mode
        } else {
            console.warn(`No setup function found for mode: ${selectedMode}`); // Warning log
        }

        // Special setup for financial mode, as it has an internal mode selector
        if (selectedMode === 'financial') {
            const financialModeSelect = document.getElementById('financial-mode');
            // Ensure the event listener is only added once or remove previous one
            financialModeSelect.removeEventListener('change', switchFinancialMode);
            financialModeSelect.addEventListener('change', switchFinancialMode);
        }
    });

    // Initial setup for the default mode (standard)
    calculatorModeSelect.value = 'standard';
    document.getElementById('standard-calculator').classList.add('display-block');
    setupStandardCalculator(); // Call setup for the initially displayed calculator
});

function resetCalculators() {
    // Reset all calculator displays when switching modes
    const displays = document.querySelectorAll('.current-operand');
    displays.forEach(display => {
        display.textContent = '0';
    });

    const prevDisplays = document.querySelectorAll('.previous-operand');
    prevDisplays.forEach(display => {
        display.textContent = '';
    });

    // Clear graphing calculator if active
    const graphCanvas = document.getElementById('graph-canvas');
    if (graphCanvas) {
        const ctx = graphCanvas.getContext('2d');
        ctx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
        // Reset graph inputs if needed
        document.getElementById('graph-equation').value = '';
        document.getElementById('x-min').value = '-10';
        document.getElementById('x-max').value = '10';
        document.getElementById('y-min').value = '-10';
        document.getElementById('y-max').value = '10';
    }

    // Clear printing tape
    const printingTape = document.getElementById('printing-tape');
    if (printingTape) {
        printingTape.textContent = '';
    }

    // Reset online calculator results
    const bmiResult = document.getElementById('bmi-result');
    if (bmiResult) bmiResult.textContent = '';
    const percentageResult = document.getElementById('percentage-result');
    if (percentageResult) percentageResult.textContent = '';
    const ageResult = document.getElementById('age-result');
    if (ageResult) ageResult.textContent = '';
    const tipResult = document.getElementById('tip-result');
    if (tipResult) tipResult.textContent = '';

    // Reset currency converter results
    const conversionRate = document.getElementById('conversion-rate');
    if (conversionRate) conversionRate.textContent = '';
    const convertedAmount = document.getElementById('converted-amount');
    if (convertedAmount) convertedAmount.textContent = '';

    // Reset unit converter results
    const convertedUnitValue = document.getElementById('converted-unit-value');
    if (convertedUnitValue) convertedUnitValue.textContent = '';

    // Reset financial calculator results
    const monthlyPayment = document.getElementById('monthly-payment');
    if (monthlyPayment) monthlyPayment.textContent = '';
    const totalInterest = document.getElementById('total-interest');
    if (totalInterest) totalInterest.textContent = '';
    const totalPayment = document.getElementById('total-payment');
    if (totalPayment) totalPayment.textContent = '';
    const futureValue = document.getElementById('future-value');
    if (futureValue) futureValue.textContent = '';
    const compoundInterest = document.getElementById('compound-interest');
    if (compoundInterest) compoundInterest.textContent = '';
}

// Standard Calculator Implementation
function setupStandardCalculator() {
    const calculator = document.getElementById('standard-calculator');
    const previousOperandElement = calculator.querySelector('.previous-operand');
    const currentOperandElement = calculator.querySelector('.current-operand');
    const buttons = calculator.querySelectorAll('button');

    let currentOperand = '0';
    let previousOperand = '';
    let operation = undefined;
    let resetScreen = false;

    function updateDisplay() {
        currentOperandElement.textContent = currentOperand;
        if (operation != null) {
            previousOperandElement.textContent = `${previousOperand} ${operation}`;
        } else {
            previousOperandElement.textContent = previousOperand;
        }
    }

    function appendNumber(number) {
        if (currentOperand === '0' || resetScreen) {
            currentOperand = number.toString();
            resetScreen = false;
        } else {
            currentOperand += number.toString();
        }
    }

    function chooseOperation(selectedOperation) {
        if (currentOperand === '') return;
        if (previousOperand !== '') {
            compute();
        }
        operation = selectedOperation;
        previousOperand = currentOperand;
        currentOperand = '';
    }

    function compute() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            default:
                return;
        }

        currentOperand = computation.toString();
        operation = undefined;
        previousOperand = '';
        resetScreen = true;
    }

    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operation = undefined;
        updateDisplay(); // Ensure display is updated after clear
    }

    function deleteNumber() {
        if (currentOperand.length === 1) {
            currentOperand = '0';
        } else {
            currentOperand = currentOperand.slice(0, -1);
        }
    }

    function addDecimalPoint() {
        if (resetScreen) {
            currentOperand = '0.';
            resetScreen = false;
            return;
        }
        if (currentOperand.includes('.')) return;
        currentOperand += '.';
    }

    // Remove existing event listeners to prevent duplicates
    buttons.forEach(button => {
        const oldClickHandler = button.onclick; // Store existing handler if any
        if (oldClickHandler) {
            button.removeEventListener('click', oldClickHandler);
        }
        // Use a named function for easier removal if needed in future
        button.onclick = null; // Clear previous inline handlers
    });

    buttons.forEach(button => {
        button.addEventListener('click', function handler() {
            if (button.dataset.action === 'number') {
                appendNumber(button.textContent);
                updateDisplay();
            } else if (button.dataset.action === 'decimal') {
                addDecimalPoint();
                updateDisplay();
            } else if (button.dataset.action === 'clear') {
                clear();
                updateDisplay();
            } else if (button.dataset.action === 'delete') {
                deleteNumber();
                updateDisplay();
            } else if (button.dataset.action === 'add' ||
                       button.dataset.action === 'subtract' ||
                       button.dataset.action === 'multiply' ||
                       button.dataset.action === 'divide') {
                chooseOperation(button.textContent);
                updateDisplay();
            } else if (button.dataset.action === 'equals') {
                compute();
                updateDisplay();
            }
        });
    });
    updateDisplay(); // Initialize display when setting up
}

// Scientific Calculator Implementation
function setupScientificCalculator() {
    const calculator = document.getElementById('scientific-calculator');
    const previousOperandElement = calculator.querySelector('.previous-operand');
    const currentOperandElement = calculator.querySelector('.current-operand');
    const buttons = calculator.querySelectorAll('button');

    let currentOperand = '0';
    let previousOperand = '';
    let operation = undefined;
    let resetScreen = false;

    function updateDisplay() {
        currentOperandElement.textContent = currentOperand;
        if (operation != null) {
            previousOperandElement.textContent = `${previousOperand} ${operation}`;
        } else {
            previousOperandElement.textContent = previousOperand;
        }
    }

    function appendNumber(number) {
        if (currentOperand === '0' || resetScreen) {
            currentOperand = number.toString();
            resetScreen = false;
        } else {
            currentOperand += number.toString();
        }
    }

    function chooseOperation(selectedOperation) {
        if (currentOperand === '') return;
        if (previousOperand !== '' && operation !== undefined) {
            compute();
        }
        operation = selectedOperation;
        previousOperand = currentOperand;
        currentOperand = '';
    }

    function compute() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            case 'x^y': // Handling power
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }

        currentOperand = computation.toString();
        operation = undefined;
        previousOperand = '';
        resetScreen = true;
    }

    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operation = undefined;
        updateDisplay(); // Ensure display is updated after clear
    }

    function deleteNumber() {
        if (currentOperand.length === 1) {
            currentOperand = '0';
        } else {
            currentOperand = currentOperand.slice(0, -1);
        }
    }

    function addDecimalPoint() {
        if (resetScreen) {
            currentOperand = '0.';
            resetScreen = false;
            return;
        }
        if (currentOperand.includes('.')) return;
        currentOperand += '.';
    }

    function calculateScientificFunction(func) {
        let current = parseFloat(currentOperand);
        if (isNaN(current)) return;

        let result;
        switch(func) {
            case 'sqrt':
                result = Math.sqrt(current);
                break;
            case 'sin':
                result = Math.sin(current * (Math.PI / 180)); // Convert to radians
                break;
            case 'cos':
                result = Math.cos(current * (Math.PI / 180));
                break;
            case 'tan':
                result = Math.tan(current * (Math.PI / 180));
                break;
            case 'asin':
                result = Math.asin(current) * (180 / Math.PI); // Convert to degrees
                break;
            case 'acos':
                result = Math.acos(current) * (180 / Math.PI);
                break;
            case 'atan':
                result = Math.atan(current) * (180 / Math.PI);
                break;
            case 'log':
                result = Math.log10(current);
                break;
            case 'ln':
                result = Math.log(current);
                break;
            case 'factorial':
                result = factorial(current);
                break;
            case 'percent':
                result = current / 100;
                break;
            case 'plus-minus':
                result = -current;
                break;
            case 'pi':
                result = Math.PI;
                break;
            case 'e':
                result = Math.E;
                break;
            default:
                return;
        }

        currentOperand = result.toString();
        resetScreen = true;
        updateDisplay();
    }

    function factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    // Remove existing event listeners to prevent duplicates
    buttons.forEach(button => {
        const oldClickHandler = button.onclick; // Store existing handler if any
        if (oldClickHandler) {
            button.removeEventListener('click', oldClickHandler);
        }
        button.onclick = null; // Clear previous inline handlers
    });


    buttons.forEach(button => {
        button.addEventListener('click', function handler() {
            const action = button.dataset.action;
            const textContent = button.textContent;

            if (action === 'number') {
                appendNumber(textContent);
                updateDisplay();
            } else if (action === 'decimal') {
                addDecimalPoint();
                updateDisplay();
            } else if (action === 'clear') {
                clear();
                updateDisplay();
            } else if (action === 'delete') {
                deleteNumber();
                updateDisplay();
            } else if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide' || action === 'power') {
                chooseOperation(action === 'power' ? '^' : textContent); // Use '^' for power
                updateDisplay();
            } else if (action === 'equals') {
                compute();
                updateDisplay();
            } else if (['sqrt', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'factorial', 'percent', 'plus-minus', 'pi', 'e'].includes(action)) {
                calculateScientificFunction(action);
            } else if (action === 'open-parenthesis' || action === 'close-parenthesis') {
                // For now, parenthesis actions are not fully implemented in the computation logic.
                // You would need a more robust parser for expression evaluation.
                appendNumber(textContent); // Just append for display for now
                updateDisplay();
            }
        });
    });
    updateDisplay(); // Initialize display when setting up
}

// Graphing Calculator Implementation (using Chart.js and Math.js)
function setupGraphingCalculator() {
    const graphCanvas = document.getElementById('graph-canvas');
    const plotButton = document.getElementById('plot-button');
    const clearPlotButton = document.getElementById('clear-plot');
    const equationInput = document.getElementById('graph-equation');
    const xMinInput = document.getElementById('x-min');
    const xMaxInput = document.getElementById('x-max');
    const yMinInput = document.getElementById('y-min');
    const yMaxInput = document.getElementById('y-max');

    let chartInstance = null;

    // Function to set canvas dimensions dynamically
    function setCanvasDimensions() {
        const container = graphCanvas.parentElement; // Get the parent div with .graph-container
        if (container) {
            // Set canvas size to match its container's current computed size
            graphCanvas.width = container.clientWidth;
            graphCanvas.height = container.clientHeight;
        }
    }

    function plotGraph() {
        // Ensure canvas dimensions are set before plotting
        setCanvasDimensions();

        const equation = equationInput.value;
        const xMin = parseFloat(xMinInput.value);
        const xMax = parseFloat(xMaxInput.value);
        const yMin = parseFloat(yMinInput.value);
        const yMax = parseFloat(yMaxInput.value);

        if (!equation || isNaN(xMin) || isNaN(xMax) || isNaN(yMin) || isNaN(yMax) || xMin >= xMax || yMin >= yMax) {
            alert('Please enter a valid equation and valid ranges.');
            return;
        }

        const data = [];
        const labels = [];
        const step = (xMax - xMin) / 200; // Increased points for smoother graph

        try {
            // Compile the expression using math.js
            const compiled = math.compile(equation);

            for (let x = xMin; x <= xMax; x += step) {
                const y = compiled.evaluate({ x: x });
                if (!isNaN(y)) { // Only check for NaN, let Chart.js handle values outside Y range for scaling
                    data.push({ x: x, y: y });
                    labels.push(x.toFixed(2));
                }
            }
        } catch (error) {
            alert('Error parsing equation: ' + error.message);
            console.error('Graphing error:', error);
            return;
        }

        if (chartInstance) {
            chartInstance.destroy(); // Destroy previous chart instance
        }

        const ctx = graphCanvas.getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: equation,
                    data: data,
                    borderColor: '#007bff',
                    backgroundColor: '#007bff',
                    showLine: true,
                    fill: false,
                    pointRadius: 0 // No points for a smooth line
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Ensure aspect ratio is not maintained by default
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'x'
                        },
                        min: xMin,
                        max: xMax,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                        title: {
                            display: true,
                            text: 'y'
                        },
                        min: yMin,
                        max: yMax,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                animation: {
                    duration: 0 // Disable animation for faster redraws
                }
            }
        });
    }

    function clearGraph() {
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }
        equationInput.value = '';
        xMinInput.value = '-10';
        xMaxInput.value = '10';
        yMinInput.value = '-10';
        yMaxInput.value = '10';
        setCanvasDimensions(); // Reset dimensions after clearing to ensure it's ready for next plot
        const ctx = graphCanvas.getContext('2d');
        ctx.clearRect(0, 0, graphCanvas.width, graphCanvas.height); // Explicitly clear canvas
    }

    // Define a named function for the resize listener to easily remove it
    function handleGraphResize() {
        setCanvasDimensions();
        if (chartInstance) {
            chartInstance.resize(); // This redraws the existing chart with new dimensions
        }
    }

    // Remove existing event listeners to prevent duplicates
    plotButton.removeEventListener('click', plotGraph);
    clearPlotButton.removeEventListener('click', clearGraph);
    window.removeEventListener('resize', handleGraphResize); // Remove previous resize listener

    // Add new event listeners
    plotButton.addEventListener('click', plotGraph);
    clearPlotButton.addEventListener('click', clearGraph);
    window.addEventListener('resize', handleGraphResize); // Add the named resize handler

    // Initial setup: set dimensions and plot if an equation is present
    setCanvasDimensions();
    // Only plot initially if there's an equation
    if (equationInput.value && equationInput.value !== '') { // Check if input has a value
        plotGraph();
    }
}

// Currency Converter Implementation
function setupCurrencyConverter() {
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const swapCurrenciesButton = document.getElementById('swap-currencies');
    const convertButton = document.getElementById('convert-button');
    const conversionRateDiv = document.getElementById('conversion-rate');
    const convertedAmountDiv = document.getElementById('converted-amount');

    // Exchange rates (simplified for demonstration, real app would use an API)
    const exchangeRates = {
        USD: { EUR: 0.92, GBP: 0.79, JPY: 156.45, AUD: 1.50, CAD: 1.37, CHF: 0.90, CNY: 7.25, INR: 83.50 },
        EUR: { USD: 1.09, GBP: 0.86, JPY: 170.00, AUD: 1.63, CAD: 1.49, CHF: 0.98, CNY: 7.87, INR: 90.50 },
        GBP: { USD: 1.27, EUR: 1.16, JPY: 198.00, AUD: 1.90, CAD: 1.73, CHF: 1.14, CNY: 9.17, INR: 105.00 },
        JPY: { USD: 0.0064, EUR: 0.0059, GBP: 0.0051, AUD: 0.0096, CAD: 0.0088, CHF: 0.0057, CNY: 0.046, INR: 0.53 },
        AUD: { USD: 0.67, EUR: 0.61, GBP: 0.53, JPY: 104.00, CAD: 0.92, CHF: 0.60, CNY: 4.82, INR: 55.40 },
        CAD: { USD: 0.73, EUR: 0.67, GBP: 0.58, JPY: 114.00, AUD: 1.09, CHF: 0.66, CNY: 5.29, INR: 60.80 },
        CHF: { USD: 1.11, EUR: 1.02, GBP: 0.88, JPY: 175.00, AUD: 1.67, CAD: 1.51, CNY: 8.05, INR: 92.50 },
        CNY: { USD: 0.14, EUR: 0.13, GBP: 0.11, JPY: 21.70, AUD: 0.21, CAD: 0.19, CHF: 0.12, INR: 11.50 },
        INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.88, AUD: 0.018, CAD: 0.016, CHF: 0.011, CNY: 0.087 }
    };

    function convertCurrency() {
        // Check if elements exist before accessing their values
        if (!amountInput || !fromCurrencySelect || !toCurrencySelect || !convertedAmountDiv || !conversionRateDiv) {
            console.error('One or more currency converter elements not found.');
            return;
        }

        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;

        if (isNaN(amount) || amount <= 0) {
            convertedAmountDiv.textContent = 'Enter a valid amount';
            conversionRateDiv.textContent = '';
            return;
        }

        if (fromCurrency === toCurrency) {
            convertedAmountDiv.textContent = `${amount.toFixed(2)} ${toCurrency}`;
            conversionRateDiv.textContent = '1.00';
            return;
        }

        const rate = exchangeRates[fromCurrency] ? exchangeRates[fromCurrency][toCurrency] : null;

        if (rate) {
            const convertedValue = amount * rate;
            conversionRateDiv.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
            convertedAmountDiv.textContent = `${convertedValue.toFixed(2)} ${toCurrency}`;
        } else {
            convertedAmountDiv.textContent = 'Conversion not available.';
            conversionRateDiv.textContent = '';
        }
    }

    function swapCurrencies() {
        // Check if elements exist before accessing their values
        if (!fromCurrencySelect || !toCurrencySelect) {
            console.error('From/To currency selects not found for swapping.');
            return;
        }
        const temp = fromCurrencySelect.value;
        fromCurrencySelect.value = toCurrencySelect.value;
        toCurrencySelect.value = temp;
        convertCurrency(); // Re-convert after swapping
    }

    // Remove existing event listeners to prevent duplicates
    // Ensure that these elements exist before attempting to remove/add listeners
    if (convertButton) convertButton.removeEventListener('click', convertCurrency);
    if (swapCurrenciesButton) swapCurrenciesButton.removeEventListener('click', swapCurrencies);
    if (amountInput) amountInput.removeEventListener('input', convertCurrency);
    if (fromCurrencySelect) fromCurrencySelect.removeEventListener('change', convertCurrency);
    if (toCurrencySelect) toCurrencySelect.removeEventListener('change', convertCurrency);


    // Add new event listeners
    if (convertButton) convertButton.addEventListener('click', convertCurrency);
    if (swapCurrenciesButton) swapCurrenciesButton.addEventListener('click', swapCurrencies);
    if (amountInput) amountInput.addEventListener('input', convertCurrency);
    if (fromCurrencySelect) fromCurrencySelect.addEventListener('change', convertCurrency);
    if (toCurrencySelect) toCurrencySelect.addEventListener('change', convertCurrency);

    // Initial conversion on setup
    convertCurrency();
}

// Unit Converter Implementation
function setupUnitConverter() {
    const unitValueInput = document.getElementById('unit-value');
    const fromUnitTypeSelect = document.getElementById('from-unit-type');
    const fromUnitSelect = document.getElementById('from-unit');
    const toUnitSelect = document.getElementById('to-unit');
    const convertUnitButton = document.getElementById('convert-unit-button');
    const convertedUnitValueDiv = document.getElementById('converted-unit-value');

    const units = {
        length: {
            meter: 1, // Base unit
            kilometer: 1000,
            centimeter: 0.01,
            millimeter: 0.001,
            mile: 1609.34,
            yard: 0.9144,
            foot: 0.3048,
            inch: 0.0254
        },
        weight: {
            kilogram: 1, // Base unit
            gram: 0.001,
            milligram: 0.000001,
            pound: 0.453592,
            ounce: 0.0283495
        },
        temperature: {
            celsius: {
                toBase: (c) => c, // For conversion logic, Celsius is treated as base
                fromBase: (c) => c,
            },
            fahrenheit: {
                toBase: (f) => (f - 32) * 5 / 9,
                fromBase: (c) => (c * 9 / 5) + 32,
            },
            kelvin: {
                toBase: (k) => k - 273.15,
                fromBase: (c) => c + 273.15,
            }
        },
        area: {
            square_meter: 1,
            square_kilometer: 1000000,
            square_centimeter: 0.0001,
            square_millimeter: 0.000001,
            acre: 4046.86,
            hectare: 10000,
            square_mile: 2589988
        },
        volume: {
            cubic_meter: 1,
            liter: 0.001,
            milliliter: 0.000001,
            gallon: 0.00378541,
            quart: 0.000946353,
            pint: 0.000473176
        },
        speed: {
            'meter_per_second': 1,
            'kilometer_per_hour': 0.277778,
            'mile_per_hour': 0.44704,
            'knot': 0.514444
        },
        time: {
            second: 1,
            minute: 60,
            hour: 3600,
            day: 86400,
            week: 604800,
            year: 31536000
        }
    };

    function populateUnitDropdowns() {
        // Ensure dropdowns exist
        if (!fromUnitTypeSelect || !fromUnitSelect || !toUnitSelect) {
            console.error('Unit converter dropdowns not found.');
            return;
        }

        const selectedType = fromUnitTypeSelect.value;
        const typeUnits = units[selectedType];

        // Clear existing options
        fromUnitSelect.innerHTML = '';
        toUnitSelect.innerHTML = '';

        for (const unitKey in typeUnits) {
            const option1 = document.createElement('option');
            option1.value = unitKey;
            option1.textContent = unitKey.replace(/_/g, ' '); // Make it more readable
            fromUnitSelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = unitKey;
            option2.textContent = unitKey.replace(/_/g, ' ');
            toUnitSelect.appendChild(option2);
        }

        // Set default selections if possible
        if (selectedType === 'temperature') {
            fromUnitSelect.value = 'celsius';
            toUnitSelect.value = 'fahrenheit';
        } else {
            // Default to the first unit in the list for other types
            const firstUnit = Object.keys(typeUnits)[0];
            fromUnitSelect.value = firstUnit;
            toUnitSelect.value = Object.keys(typeUnits)[1] || firstUnit; // Set to second or first if only one
        }

        convertUnit(); // Perform conversion after populating
    }

    function convertUnit() {
        // Ensure all required elements exist
        if (!unitValueInput || !fromUnitTypeSelect || !fromUnitSelect || !toUnitSelect || !convertedUnitValueDiv) {
            console.error('One or more unit converter elements not found for conversion.');
            return;
        }

        const value = parseFloat(unitValueInput.value);
        const fromUnitType = fromUnitTypeSelect.value;
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;

        if (isNaN(value)) {
            convertedUnitValueDiv.textContent = 'Enter a valid number.';
            return;
        }

        if (fromUnit === toUnit) {
            convertedUnitValueDiv.textContent = `${value} ${toUnit.replace(/_/g, ' ')}`;
            return;
        }

        if (fromUnitType === 'temperature') {
            const fromConverter = units.temperature[fromUnit];
            const toConverter = units.temperature[toUnit];

            if (fromConverter && toConverter) {
                const baseValue = fromConverter.toBase(value);
                const convertedValue = toConverter.fromBase(baseValue);
                convertedUnitValueDiv.textContent = `${convertedValue.toFixed(2)} ${toUnit.replace(/_/g, ' ')}`;
            } else {
                convertedUnitValueDiv.textContent = 'Invalid temperature units.';
            }
        } else {
            const fromFactor = units[fromUnitType][fromUnit];
            const toFactor = units[fromUnitType][toUnit];

            if (fromFactor !== undefined && toFactor !== undefined) {
                const convertedValue = (value * fromFactor) / toFactor;
                convertedUnitValueDiv.textContent = `${convertedValue.toFixed(6)} ${toUnit.replace(/_/g, ' ')}`;
            } else {
                convertedUnitValueDiv.textContent = 'Invalid unit selection.';
            }
        }
    }

    // Remove existing event listeners to prevent duplicates
    if (fromUnitTypeSelect) fromUnitTypeSelect.removeEventListener('change', populateUnitDropdowns);
    if (fromUnitSelect) fromUnitSelect.removeEventListener('change', convertUnit);
    if (toUnitSelect) toUnitSelect.removeEventListener('change', convertUnit);
    if (unitValueInput) unitValueInput.removeEventListener('input', convertUnit);
    if (convertUnitButton) convertUnitButton.removeEventListener('click', convertUnit);


    // Add new event listeners
    if (fromUnitTypeSelect) fromUnitTypeSelect.addEventListener('change', populateUnitDropdowns);
    if (fromUnitSelect) fromUnitSelect.addEventListener('change', convertUnit);
    if (toUnitSelect) toUnitSelect.addEventListener('change', convertUnit);
    if (unitValueInput) unitValueInput.addEventListener('input', convertUnit);
    if (convertUnitButton) convertUnitButton.addEventListener('click', convertUnit);

    // Initial population and conversion
    populateUnitDropdowns();
}

// Financial Calculator Implementation
function setupFinancialCalculators() {
    // Loan Calculator elements
    const loanAmountInput = document.getElementById('loan-amount');
    const interestRateInput = document.getElementById('interest-rate');
    const loanTermInput = document.getElementById('loan-term');
    const calculateLoanButton = document.getElementById('calculate-loan');
    const monthlyPaymentSpan = document.getElementById('monthly-payment');
    const totalInterestSpan = document.getElementById('total-interest');
    const totalPaymentSpan = document.getElementById('total-payment');

    function calculateLoan() {
        // Ensure elements exist
        if (!loanAmountInput || !interestRateInput || !loanTermInput || !monthlyPaymentSpan || !totalInterestSpan || !totalPaymentSpan) {
            console.error('One or more loan calculator elements not found.');
            return;
        }

        const P = parseFloat(loanAmountInput.value); // Principal
        const R_annual = parseFloat(interestRateInput.value); // Annual interest rate
        const N = parseFloat(loanTermInput.value); // Loan term in years

        if (isNaN(P) || isNaN(R_annual) || isNaN(N) || P <= 0 || R_annual < 0 || N <= 0) {
            monthlyPaymentSpan.textContent = 'N/A';
            totalInterestSpan.textContent = 'N/A';
            totalPaymentSpan.textContent = 'N/A';
            return;
        }

        const r = (R_annual / 100) / 12; // Monthly interest rate
        const n = N * 12; // Total number of payments

        let monthlyPayment;
        if (r === 0) { // Simple interest case for 0% interest
            monthlyPayment = P / n;
        } else {
            monthlyPayment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        }

        const totalPayment = monthlyPayment * n;
        const totalInterest = totalPayment - P;

        monthlyPaymentSpan.textContent = `$${monthlyPayment.toFixed(2)}`;
        totalInterestSpan.textContent = `$${totalInterest.toFixed(2)}`;
        totalPaymentSpan.textContent = `$${totalPayment.toFixed(2)}`;
    }

    // Remove existing event listeners to prevent duplicates
    if (calculateLoanButton) calculateLoanButton.removeEventListener('click', calculateLoan);
    if (loanAmountInput) loanAmountInput.removeEventListener('input', calculateLoan);
    if (interestRateInput) interestRateInput.removeEventListener('input', calculateLoan);
    if (loanTermInput) loanTermInput.removeEventListener('input', calculateLoan);

    // Add new event listeners
    if (calculateLoanButton) calculateLoanButton.addEventListener('click', calculateLoan);
    if (loanAmountInput) loanAmountInput.addEventListener('input', calculateLoan);
    if (interestRateInput) interestRateInput.addEventListener('input', calculateLoan);
    if (loanTermInput) loanTermInput.addEventListener('input', calculateLoan);

    // Compound Interest Calculator elements
    const principalInput = document.getElementById('principal');
    const compoundRateInput = document.getElementById('compound-rate');
    const compoundYearsInput = document.getElementById('compound-years');
    const compoundFrequencySelect = document.getElementById('compound-frequency');
    const calculateCompoundButton = document.getElementById('calculate-compound');
    const futureValueSpan = document.getElementById('future-value');
    const compoundInterestSpan = document.getElementById('compound-interest');

    function calculateCompoundInterest() {
        // Ensure elements exist
        if (!principalInput || !compoundRateInput || !compoundYearsInput || !compoundFrequencySelect || !futureValueSpan || !compoundInterestSpan) {
            console.error('One or more compound interest calculator elements not found.');
            return;
        }

        const P = parseFloat(principalInput.value); // Principal
        const R_annual = parseFloat(compoundRateInput.value); // Annual interest rate
        const T = parseFloat(compoundYearsInput.value); // Years
        const N_compound = parseFloat(compoundFrequencySelect.value); // Compounding frequency per year

        if (isNaN(P) || isNaN(R_annual) || isNaN(T) || isNaN(N_compound) || P < 0 || R_annual < 0 || T < 0 || N_compound <= 0) {
            futureValueSpan.textContent = 'N/A';
            compoundInterestSpan.textContent = 'N/A';
            return;
        }

        const r = R_annual / 100; // Convert percentage to decimal

        const futureValue = P * Math.pow((1 + (r / N_compound)), (N_compound * T));
        const totalInterest = futureValue - P;

        futureValueSpan.textContent = `$${futureValue.toFixed(2)}`;
        compoundInterestSpan.textContent = `$${totalInterest.toFixed(2)}`;
    }

    // Remove existing event listeners to prevent duplicates
    if (calculateCompoundButton) calculateCompoundButton.removeEventListener('click', calculateCompoundInterest);
    if (principalInput) principalInput.removeEventListener('input', calculateCompoundInterest);
    if (compoundRateInput) compoundRateInput.removeEventListener('input', calculateCompoundInterest);
    if (compoundYearsInput) compoundYearsInput.removeEventListener('input', calculateCompoundInterest);
    if (compoundFrequencySelect) compoundFrequencySelect.removeEventListener('change', calculateCompoundInterest);


    // Add new event listeners
    if (calculateCompoundButton) calculateCompoundButton.addEventListener('click', calculateCompoundInterest);
    if (principalInput) principalInput.addEventListener('input', calculateCompoundInterest);
    if (compoundRateInput) compoundRateInput.addEventListener('input', calculateCompoundInterest);
    if (compoundYearsInput) compoundYearsInput.addEventListener('input', calculateCompoundInterest);
    if (compoundFrequencySelect) compoundFrequencySelect.addEventListener('change', calculateCompoundInterest);

    // Initial calculations
    calculateLoan();
    calculateCompoundInterest();
}

function switchFinancialMode() {
    const financialModeSelect = document.getElementById('financial-mode');
    if (!financialModeSelect) {
        console.error('Financial mode select dropdown not found.');
        return;
    }
    const selectedMode = financialModeSelect.value;
    const financialSections = document.querySelectorAll('.financial-section');

    financialSections.forEach(section => {
        section.style.display = 'none';
    });

    const targetSection = document.getElementById(`${selectedMode}-calculator`);
    if (targetSection) {
        targetSection.style.display = 'block';
    } else {
        console.error(`Financial section with ID: ${selectedMode}-calculator not found.`);
    }
}

// Printing Calculator Implementation
function setupPrintingCalculator() {
    const calculator = document.getElementById('printing-calculator');
    const printingTape = document.getElementById('printing-tape');
    const currentPrintingValueElement = calculator.querySelector('.current-printing-value');
    const buttons = calculator.querySelectorAll('button');

    let currentOperand = '0';
    let previousOperand = '';
    let operation = undefined;
    let resetScreen = false;
    let tapeContent = '';

    function updateDisplay() {
        if (currentPrintingValueElement) {
            currentPrintingValueElement.textContent = currentOperand;
        }
    }

    function appendToTape(entry) {
        if (printingTape) {
            tapeContent += entry + '\n';
            printingTape.textContent = tapeContent;
            printingTape.scrollTop = printingTape.scrollHeight; // Scroll to bottom
        }
    }

    function appendNumber(number) {
        if (currentOperand === '0' || resetScreen) {
            currentOperand = number.toString();
            resetScreen = false;
        } else {
            currentOperand += number.toString();
        }
    }

    function chooseOperation(selectedOperation) {
        if (currentOperand === '') return;
        if (previousOperand !== '') {
            compute();
        }
        operation = selectedOperation;
        previousOperand = currentOperand;
        currentOperand = '';
    }

    function compute() {
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        let computation;
        let symbol = '';
        switch (operation) {
            case '+':
                computation = prev + current;
                symbol = '+';
                break;
            case '-':
                computation = prev - current;
                symbol = '-';
                break;
            case '*':
                computation = prev * current;
                symbol = '*';
                break;
            case '/':
                computation = prev / current;
                symbol = '/';
                break;
            default:
                return;
        }

        appendToTape(`${previousOperand} ${symbol} ${current} = ${computation.toFixed(2)}`);
        currentOperand = computation.toString();
        operation = undefined;
        previousOperand = '';
        resetScreen = true;
    }

    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operation = undefined;
        resetScreen = false;
        updateDisplay();
    }

    function clearTape() {
        tapeContent = '';
        if (printingTape) {
            printingTape.textContent = '';
        }
    }

    function addDecimalPoint() {
        if (resetScreen) {
            currentOperand = '0.';
            resetScreen = false;
            return;
        }
        if (currentOperand.includes('.')) return;
        currentOperand += '.';
    }

    function printCurrentValue() {
        appendToTape(`PRINT: ${currentOperand}`);
    }

    // Remove existing event listeners to prevent duplicates
    buttons.forEach(button => {
        const oldClickHandler = button.onclick; // Store existing handler if any
        if (oldClickHandler) {
            button.removeEventListener('click', oldClickHandler);
        }
        button.onclick = null; // Clear previous inline handlers
    });

    buttons.forEach(button => {
        button.addEventListener('click', function handler() {
            const action = button.dataset.action;
            const textContent = button.textContent;

            if (action === 'number') {
                appendNumber(textContent);
                updateDisplay();
            } else if (action === 'decimal') {
                addDecimalPoint();
                updateDisplay();
            } else if (action === 'clear') {
                clear();
                updateDisplay();
            } else if (action === 'print-clear-tape') {
                clearTape();
            } else if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide') {
                chooseOperation(textContent);
                updateDisplay();
            } else if (action === 'printing-equals') {
                compute();
                updateDisplay();
            } else if (action === 'print') {
                printCurrentValue();
            }
        });
    });
    updateDisplay(); // Initialize display when setting up
}

// Online Calculators Implementation
function setupOnlineCalculators() {
    // BMI Calculator
    const bmiWeightInput = document.getElementById('bmi-weight');
    const bmiHeightInput = document.getElementById('bmi-height');
    const calculateBmiButton = document.getElementById('calculate-bmi');
    const bmiResultDiv = document.getElementById('bmi-result');

    function calculateBMI() {
        // Ensure elements exist
        if (!bmiWeightInput || !bmiHeightInput || !bmiResultDiv) {
            console.error('One or more BMI calculator elements not found.');
            return;
        }
        const weight = parseFloat(bmiWeightInput.value); // kg
        const height = parseFloat(bmiHeightInput.value); // cm

        if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
            bmiResultDiv.textContent = 'Please enter valid weight and height.';
            return;
        }

        const heightInMeters = height / 100; // Convert cm to meters
        const bmi = weight / (heightInMeters * heightInMeters);

        let category = '';
        if (bmi < 18.5) {
            category = 'Underweight';
        } else if (bmi >= 18.5 && bmi < 24.9) {
            category = 'Normal weight';
        } else if (bmi >= 25 && bmi < 29.9) {
            category = 'Overweight';
        } else {
            category = 'Obesity';
        }

        bmiResultDiv.textContent = `Your BMI: ${bmi.toFixed(2)} (${category})`;
    }

    // Remove existing event listeners to prevent duplicates
    if (calculateBmiButton) calculateBmiButton.removeEventListener('click', calculateBMI);
    if (bmiWeightInput) bmiWeightInput.removeEventListener('input', calculateBMI);
    if (bmiHeightInput) bmiHeightInput.removeEventListener('input', calculateBMI);

    // Add new event listeners
    if (calculateBmiButton) calculateBmiButton.addEventListener('click', calculateBMI);
    if (bmiWeightInput) bmiWeightInput.addEventListener('input', calculateBMI);
    if (bmiHeightInput) bmiHeightInput.addEventListener('input', calculateBMI);


    // Percentage Calculator
    const percentageValueInput = document.getElementById('percentage-value');
    const percentageOfInput = document.getElementById('percentage-of');
    const calculatePercentageButton = document.getElementById('calculate-percentage');
    const percentageResultDiv = document.getElementById('percentage-result');

    function calculatePercentage() {
        // Ensure elements exist
        if (!percentageValueInput || !percentageOfInput || !percentageResultDiv) {
            console.error('One or more percentage calculator elements not found.');
            return;
        }
        const value = parseFloat(percentageValueInput.value);
        const of = parseFloat(percentageOfInput.value);

        if (isNaN(value) || isNaN(of)) {
            percentageResultDiv.textContent = 'Please enter valid numbers.';
            return;
        }

        const result = (value / 100) * of;
        percentageResultDiv.textContent = `${value}% of ${of} is ${result.toFixed(2)}`;
    }

    // Remove existing event listeners to prevent duplicates
    if (calculatePercentageButton) calculatePercentageButton.removeEventListener('click', calculatePercentage);
    if (percentageValueInput) percentageValueInput.removeEventListener('input', calculatePercentage);
    if (percentageOfInput) percentageOfInput.removeEventListener('input', calculatePercentage);

    // Add new event listeners
    if (calculatePercentageButton) calculatePercentageButton.addEventListener('click', calculatePercentage);
    if (percentageValueInput) percentageValueInput.addEventListener('input', calculatePercentage);
    if (percentageOfInput) percentageOfInput.addEventListener('input', calculatePercentage);


    // Age Calculator
    const birthDateInput = document.getElementById('birth-date');
    const calculateAgeButton = document.getElementById('calculate-age');
    const ageResultDiv = document.getElementById('age-result');

    function calculateAge() {
        // Ensure elements exist
        if (!birthDateInput || !ageResultDiv) {
            console.error('One or more age calculator elements not found.');
            return;
        }
        const birthDate = new Date(birthDateInput.value);
        if (isNaN(birthDate.getTime())) {
            ageResultDiv.textContent = 'Please enter a valid birth date.';
            return;
        }

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        ageResultDiv.textContent = `Your age is: ${age} years`;
    }

    // Remove existing event listeners to prevent duplicates
    if (calculateAgeButton) calculateAgeButton.removeEventListener('click', calculateAge);
    if (birthDateInput) birthDateInput.removeEventListener('change', calculateAge);

    // Add new event listeners
    if (calculateAgeButton) calculateAgeButton.addEventListener('click', calculateAge);
    if (birthDateInput) birthDateInput.addEventListener('change', calculateAge);


    // Tip Calculator
    const billAmountInput = document.getElementById('bill-amount');
    const tipPercentageInput = document.getElementById('tip-percentage');
    const calculateTipButton = document.getElementById('calculate-tip');
    const tipResultDiv = document.getElementById('tip-result');

    function calculateTip() {
        // Ensure elements exist
        if (!billAmountInput || !tipPercentageInput || !tipResultDiv) {
            console.error('One or more tip calculator elements not found.');
            return;
        }
        const billAmount = parseFloat(billAmountInput.value);
        const tipPercentage = parseFloat(tipPercentageInput.value);

        if (isNaN(billAmount) || isNaN(tipPercentage) || billAmount < 0 || tipPercentage < 0) {
            tipResultDiv.textContent = 'Please enter valid amounts.';
            return;
        }

        const tipAmount = billAmount * (tipPercentage / 100);
        const totalBill = billAmount + tipAmount;

        tipResultDiv.innerHTML = `Tip: $${tipAmount.toFixed(2)}<br>Total with Tip: $${totalBill.toFixed(2)}`;
    }

    // Remove existing event listeners to prevent duplicates
    if (calculateTipButton) calculateTipButton.removeEventListener('click', calculateTip);
    if (billAmountInput) billAmountInput.removeEventListener('input', calculateTip);
    if (tipPercentageInput) tipPercentageInput.removeEventListener('input', calculateTip);

    // Add new event listeners
    if (calculateTipButton) calculateTipButton.addEventListener('click', calculateTip);
    if (billAmountInput) billAmountInput.addEventListener('input', calculateTip);
    if (tipPercentageInput) tipPercentageInput.addEventListener('input', calculateTip);
}
