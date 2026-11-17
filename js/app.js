/**
 * ====================================================================
 * SHA-256 Secure Hash Generator - UI Controller & Event Handler
 * Course: Cryptography and Network Security (CNS) Mini Project
 * Focus: Beginner-Friendly, Interactive Visual Learning
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // State references
    let latestTextHash = '';
    let latestFileHash = '';
    let currentFile = null;

    // Toast Utility
    const toastContainer = document.getElementById('toast-container');
    function showToast(message, type = 'info') {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let iconClass = 'fa-solid fa-circle-info';
        if (type === 'success') iconClass = 'fa-solid fa-circle-check';
        if (type === 'error') iconClass = 'fa-solid fa-circle-exclamation';

        toast.innerHTML = `<i class="${iconClass}"></i><span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Clipboard Copy Helper
    async function copyToClipboard(text, label = 'Hash') {
        if (!text || text.includes('No hash') || text.includes('Calculating')) {
            showToast('No hash to copy!', 'error');
            return;
        }
        try {
            await navigator.clipboard.writeText(text);
            showToast(`${label} copied to clipboard!`, 'success');
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast(`${label} copied to clipboard!`, 'success');
        }
    }

    /* ====================================================================
       MODE SWITCHER TABS (Clean 1-at-a-time view)
       ==================================================================== */
    const modeTabBtns = document.querySelectorAll('.mode-tab-btn');
    const contentPanes = document.querySelectorAll('.content-pane');

    function switchTab(targetId) {
        modeTabBtns.forEach(btn => {
            if (btn.getAttribute('data-target') === targetId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        contentPanes.forEach(pane => {
            if (pane.id === targetId) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });

        window.scrollTo({ top: 120, behavior: 'smooth' });
    }

    modeTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            switchTab(targetId);
        });
    });

    /* ====================================================================
       INTERACTIVE 5-STEP MACHINE VISUALIZER
       ==================================================================== */
    const visualizerInput = document.getElementById('visualizer-input');
    const visStep1 = document.getElementById('vis-step-1');
    const visStep2 = document.getElementById('vis-step-2');
    const visHashOutput = document.getElementById('visualizer-hash-output');

    async function updateVisualizer() {
        if (!visualizerInput) return;
        const text = visualizerInput.value;
        const charLen = text.length;
        const byteLen = new TextEncoder().encode(text).length;

        visStep1.textContent = `${charLen} letter${charLen === 1 ? '' : 's'}`;
        visStep2.textContent = `${byteLen * 8} bits`;

        if (text.length === 0) {
            visHashOutput.textContent = 'Type a word above to see its hash...';
            return;
        }

        try {
            const res = await CryptoEngine.hashText(text, 'SHA-256');
            visHashOutput.textContent = res.hash;
        } catch (err) {
            console.error(err);
        }
    }

    if (visualizerInput) {
        visualizerInput.addEventListener('input', updateVisualizer);
        updateVisualizer();
    }

    /* ====================================================================
       1. TEXT HASH GENERATOR MODULE
       ==================================================================== */
    const textInput = document.getElementById('text-input');
    const textCharCounter = document.getElementById('text-char-counter');
    const textAlgoSelect = document.getElementById('text-algo-select');
    const textAlgoDisplay = document.getElementById('text-algo-display');
    const liveHashToggle = document.getElementById('live-hash-toggle');
    const btnGenerateText = document.getElementById('btn-generate-text-hash');
    const btnClearText = document.getElementById('btn-clear-text');
    const textHashOutput = document.getElementById('text-hash-output');
    const textDigestLength = document.getElementById('text-digest-length');
    const textDigestTime = document.getElementById('text-digest-time');
    const btnCopyTextHash = document.getElementById('btn-copy-text-hash');
    const btnSendToCompare = document.getElementById('btn-send-to-compare');
    const sampleChips = document.querySelectorAll('.sample-chip[data-sample]');

    async function computeTextHash() {
        const text = textInput.value;
        const algo = textAlgoSelect.value;
        textAlgoDisplay.textContent = algo;

        const bytes = new TextEncoder().encode(text).length;
        textCharCounter.textContent = `${text.length} chars | ${bytes} bytes`;

        if (text.length === 0) {
            textHashOutput.className = 'hash-container empty';
            textHashOutput.textContent = 'No hash yet. Type text above and click Generate.';
            textDigestLength.textContent = '256 bits (64 hex characters)';
            textDigestTime.textContent = '0.00 ms';
            latestTextHash = '';
            return;
        }

        try {
            const result = await CryptoEngine.hashText(text, algo);
            latestTextHash = result.hash;
            textHashOutput.className = 'hash-container';
            textHashOutput.textContent = result.hash;
            textDigestLength.textContent = `${result.bitLength} bits (${result.hash.length} hex chars)`;
            textDigestTime.textContent = `${result.durationMs} ms`;
        } catch (err) {
            console.error('Hashing error:', err);
            showToast('Error calculating hash: ' + err.message, 'error');
        }
    }

    textInput.addEventListener('input', () => {
        if (liveHashToggle.checked) {
            computeTextHash();
        } else {
            const bytes = new TextEncoder().encode(textInput.value).length;
            textCharCounter.textContent = `${textInput.value.length} chars | ${bytes} bytes`;
        }
    });

    textAlgoSelect.addEventListener('change', computeTextHash);

    btnGenerateText.addEventListener('click', () => {
        computeTextHash();
        if (textInput.value.trim().length > 0) {
            showToast('Hash generated successfully!', 'success');
        } else {
            showToast('Please type text first or click a sample.', 'info');
        }
    });

    btnClearText.addEventListener('click', () => {
        textInput.value = '';
        computeTextHash();
        showToast('Input cleared.', 'info');
    });

    sampleChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const sample = chip.getAttribute('data-sample');
            textInput.value = sample;
            computeTextHash();
            showToast(`Loaded sample: "${sample}"`, 'info');
        });
    });

    btnCopyTextHash.addEventListener('click', () => {
        copyToClipboard(latestTextHash, 'Text Hash');
    });

    btnSendToCompare.addEventListener('click', () => {
        if (!latestTextHash) {
            showToast('Generate a text hash first!', 'error');
            return;
        }
        const hashInput1 = document.getElementById('hash-input-1');
        hashInput1.value = latestTextHash;
        switchTab('tab-compare');
        showToast('Transferred to Tamper Detector (Hash A)!', 'success');
    });

    computeTextHash();

    /* ====================================================================
       2. FILE HASH GENERATOR MODULE
       ==================================================================== */
    const fileDropzone = document.getElementById('file-dropzone');
    const fileInput = document.getElementById('file-input');
    const fileMetaContainer = document.getElementById('file-meta-container');
    const fileMetaName = document.getElementById('file-meta-name');
    const fileMetaSize = document.getElementById('file-meta-size');
    const fileMetaType = document.getElementById('file-meta-type');
    const fileMetaTime = document.getElementById('file-meta-time');
    const fileHashOutput = document.getElementById('file-hash-output');
    const fileDigestBits = document.getElementById('file-digest-bits');
    const btnCopyFileHash = document.getElementById('btn-copy-file-hash');
    const btnSendFileToCompare = document.getElementById('btn-send-file-to-compare');
    const btnDownloadChecksum = document.getElementById('btn-download-checksum');
    const btnClearFile = document.getElementById('btn-clear-file');
    const expectedFileHashInput = document.getElementById('expected-file-hash');
    const btnVerifyFileChecksum = document.getElementById('btn-verify-file-checksum');
    const fileChecksumFeedback = document.getElementById('file-checksum-feedback');

    fileDropzone.addEventListener('click', () => fileInput.click());

    fileDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileDropzone.classList.add('dragover');
    });

    fileDropzone.addEventListener('dragleave', () => {
        fileDropzone.classList.remove('dragover');
    });

    fileDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        fileDropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files.length > 0) {
            handleFileSelection(fileInput.files[0]);
        }
    });

    async function handleFileSelection(file) {
        currentFile = file;
        fileMetaContainer.style.display = 'block';
        fileMetaName.textContent = file.name;
        fileMetaSize.textContent = CryptoEngine.formatFileSize(file.size);
        fileMetaType.textContent = file.type || 'Binary / Unspecified';
        fileMetaTime.textContent = 'Calculating...';
        fileHashOutput.textContent = 'Computing SHA-256 in memory...';

        try {
            const buffer = await file.arrayBuffer();
            const result = await CryptoEngine.hashBuffer(buffer, 'SHA-256');
            latestFileHash = result.hash;
            fileHashOutput.textContent = result.hash;
            fileMetaTime.textContent = `${result.durationMs} ms`;
            fileDigestBits.textContent = `${result.bitLength} bits`;
            showToast(`Fingerprint calculated for "${file.name}"`, 'success');
        } catch (err) {
            console.error(err);
            fileHashOutput.textContent = 'Error computing file hash: ' + err.message;
            showToast('Failed to read file.', 'error');
        }
    }

    btnCopyFileHash.addEventListener('click', () => {
        copyToClipboard(latestFileHash, 'File Hash');
    });

    btnSendFileToCompare.addEventListener('click', () => {
        if (!latestFileHash) {
            showToast('Upload a file first to get its hash!', 'error');
            return;
        }
        const hashInput2 = document.getElementById('hash-input-2');
        hashInput2.value = latestFileHash;
        switchTab('tab-compare');
        showToast('Transferred to Tamper Detector (Hash B)!', 'success');
    });

    btnDownloadChecksum.addEventListener('click', () => {
        if (!latestFileHash || !currentFile) {
            showToast('No file hash to download!', 'error');
            return;
        }
        const content = `${latestFileHash}  ${currentFile.name}\n`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentFile.name}.sha256`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(`Saved checksum file: ${currentFile.name}.sha256`, 'success');
    });

    btnClearFile.addEventListener('click', () => {
        currentFile = null;
        latestFileHash = '';
        fileInput.value = '';
        fileMetaContainer.style.display = 'none';
        expectedFileHashInput.value = '';
        fileChecksumFeedback.style.display = 'none';
        showToast('File removed.', 'info');
    });

    btnVerifyFileChecksum.addEventListener('click', () => {
        const expected = expectedFileHashInput.value.trim().toLowerCase();
        if (!expected) {
            showToast('Paste the expected 64-character hash first.', 'error');
            return;
        }
        if (!latestFileHash) {
            showToast('Upload a file first.', 'error');
            return;
        }

        const comp = CryptoEngine.compareHashes(expected, latestFileHash);
        fileChecksumFeedback.style.display = 'block';
        if (comp.isMatch) {
            fileChecksumFeedback.style.color = 'var(--accent-emerald)';
            fileChecksumFeedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> <strong>MATCH!</strong> File is 100% authentic and untampered.`;
            showToast('Checksum matches! File is authentic.', 'success');
        } else {
            fileChecksumFeedback.style.color = 'var(--danger)';
            fileChecksumFeedback.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <strong>MISMATCH!</strong> File hash does NOT match the expected value. The file is corrupt or altered.`;
            showToast('Warning: Checksums do not match!', 'error');
        }
    });

    /* ====================================================================
       3. TAMPER DETECTOR (HASH COMPARATOR)
       ==================================================================== */
    const hashInput1 = document.getElementById('hash-input-1');
    const hashInput2 = document.getElementById('hash-input-2');
    const btnCompareHashes = document.getElementById('btn-compare-hashes');
    const btnSimulateTamper = document.getElementById('btn-simulate-tamper');
    const btnResetCompare = document.getElementById('btn-reset-compare');
    const btnPasteToHash1 = document.getElementById('btn-paste-to-hash1');
    const btnPasteToHash2 = document.getElementById('btn-paste-to-hash2');
    const compareResultBox = document.getElementById('compare-result-box');
    const compareIcon = document.getElementById('compare-icon');
    const compareStatusTitle = document.getElementById('compare-status-title');
    const compareStatusDesc = document.getElementById('compare-status-desc');

    btnPasteToHash1.addEventListener('click', () => {
        if (!latestTextHash) {
            showToast('Generate a text hash first!', 'error');
            return;
        }
        hashInput1.value = latestTextHash;
        showToast('Pasted into Hash A.', 'info');
    });

    btnPasteToHash2.addEventListener('click', () => {
        if (!latestFileHash) {
            showToast('Upload a file first!', 'error');
            return;
        }
        hashInput2.value = latestFileHash;
        showToast('Pasted into Hash B.', 'info');
    });

    btnCompareHashes.addEventListener('click', () => {
        const h1 = hashInput1.value;
        const h2 = hashInput2.value;

        if (!h1.trim() || !h2.trim()) {
            showToast('Please enter both hash values to compare.', 'error');
            return;
        }

        const result = CryptoEngine.compareHashes(h1, h2);
        compareResultBox.className = 'comparison-result-banner ' + (result.isMatch ? 'match' : 'mismatch');
        
        if (result.isMatch) {
            compareIcon.className = 'fa-solid fa-circle-check';
            compareStatusTitle.textContent = 'MATCH - DATA INTEGRITY CONFIRMED';
            compareStatusDesc.textContent = 'Both hashes are 100% identical. The data has not been modified or corrupted in any way.';
            showToast('Match confirmed! Integrity intact.', 'success');
        } else {
            compareIcon.className = 'fa-solid fa-triangle-exclamation';
            compareStatusTitle.textContent = 'MISMATCH - TAMPERING DETECTED!';
            compareStatusDesc.textContent = `${result.reason} Even changing 1 character makes the hashes totally different.`;
            showToast('Alert: Hashes do not match!', 'error');
        }
    });

    btnSimulateTamper.addEventListener('click', () => {
        if (!hashInput1.value.trim()) {
            hashInput1.value = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
        }
        const val = hashInput1.value.trim();
        if (val.length > 0) {
            const lastChar = val[val.length - 1];
            const flippedChar = (lastChar === 'a' || lastChar === '0') ? 'b' : '0';
            const tampered = val.substring(0, val.length - 1) + flippedChar;
            hashInput2.value = tampered;
            showToast('Hacker simulated: Altered last character of Hash B!', 'error');
            btnCompareHashes.click();
        }
    });

    btnResetCompare.addEventListener('click', () => {
        hashInput1.value = '';
        hashInput2.value = '';
        compareResultBox.className = 'comparison-result-banner idle';
        compareIcon.className = 'fa-solid fa-scale-balanced';
        compareStatusTitle.textContent = 'Ready for Comparison';
        compareStatusDesc.textContent = 'Enter two hash values above and click "Compare Hashes".';
        showToast('Comparator cleared.', 'info');
    });

    /* ====================================================================
       4. AVALANCHE EFFECT MODULE
       ==================================================================== */
    const avalancheInputA = document.getElementById('avalanche-input-a');
    const avalancheInputB = document.getElementById('avalanche-input-b');
    const avStatTotalBits = document.getElementById('av-stat-total-bits');
    const avStatDiffBits = document.getElementById('av-stat-diff-bits');
    const avStatFlipPct = document.getElementById('av-stat-flip-pct');
    const avStatHexDiff = document.getElementById('av-stat-hex-diff');
    const avalancheHashA = document.getElementById('avalanche-hash-a');
    const avalancheHashB = document.getElementById('avalanche-hash-b');

    const presetAv1 = document.getElementById('preset-av-1');
    const presetAv2 = document.getElementById('preset-av-2');
    const presetAv3 = document.getElementById('preset-av-3');

    async function updateAvalancheEffect() {
        const textA = avalancheInputA.value;
        const textB = avalancheInputB.value;

        if (!textA && !textB) {
            avalancheHashA.innerHTML = '<span class="diff-char-match">No text provided.</span>';
            avalancheHashB.innerHTML = '<span class="diff-char-match">No text provided.</span>';
            avStatDiffBits.textContent = '0';
            avStatFlipPct.textContent = '0.00%';
            avStatHexDiff.textContent = '0 / 64';
            return;
        }

        const data = await CryptoEngine.computeAvalanche(textA, textB, 'SHA-256');

        avStatTotalBits.textContent = data.totalBits;
        avStatDiffBits.textContent = `${data.diffBits}`;
        avStatFlipPct.textContent = `${data.flippedPercentage}%`;
        avStatHexDiff.textContent = `${data.diffHexChars} / ${data.totalHexChars}`;

        avalancheHashA.innerHTML = data.hashA;

        const bCharsHtml = data.hexComparison.map(item => {
            if (item.isDiff) {
                return `<span class="diff-char-flip" title="Changed at position ${item.index}">${item.charB}</span>`;
            } else {
                return `<span class="diff-char-match">${item.charB}</span>`;
            }
        }).join('');

        avalancheHashB.innerHTML = bCharsHtml;
    }

    avalancheInputA.addEventListener('input', updateAvalancheEffect);
    avalancheInputB.addEventListener('input', updateAvalancheEffect);

    presetAv1.addEventListener('click', () => {
        avalancheInputA.value = 'apple';
        avalancheInputB.value = 'Apple';
        updateAvalancheEffect();
        showToast('Loaded: "apple" vs "Apple"', 'info');
    });

    presetAv2.addEventListener('click', () => {
        avalancheInputA.value = 'SecurePassword2026';
        avalancheInputB.value = 'SecurePassword2026.';
        updateAvalancheEffect();
        showToast('Loaded: Added 1 period at end', 'info');
    });

    presetAv3.addEventListener('click', () => {
        avalancheInputA.value = 'CNS-PROJECT-2026';
        avalancheInputB.value = 'CNS-PROJECT-2027';
        updateAvalancheEffect();
        showToast('Loaded: Changed 1 digit', 'info');
    });

    updateAvalancheEffect();

    /* ====================================================================
       5. VIVA ACCORDION
       ==================================================================== */
    const vivaQuestions = document.querySelectorAll('.viva-question');
    vivaQuestions.forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            item.classList.toggle('open');
        });
    });
});
