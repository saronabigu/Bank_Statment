document.addEventListener('DOMContentLoaded', () => {
    const toggleList = document.querySelectorAll('.toggle');
    const actionsContainer = document.querySelector('.account-actions');
    const usersList = [
        {
            id: 123,
            firstName: 'Nate',
            lastName: 'Haile',
            email: 'natnael@gmail.com',
            tel: '00447654312566',
            address: {
                line1: '1 Oxford House',
                line2: 'Victoria Street',
                postcode: 'SW1E 5AD',
                city: 'London'
            },
            accounts: new Map([
                ['AC12345', {
                    id: 321,
                    type: 'CurrentAccount',
                    accountNumber: 'AC12345',
                    sortCode: '110022',
                    balance: 10547
                }]
            ])
        },
        {
            id: 124,
            firstName: 'Daniel',
            lastName: 'Ghirmay',
            email: 'daniel@gmail.com',
            tel: '00447854712566',
            address: {
                line1: 'Flat 1 George House',
                line2: 'King William Road',
                postcode: 'WC1 2HA',
                city: 'London'
            },
            accounts: new Map([
                ['AC12312', {
                    id: 543,
                    type: 'CurrentAccount',
                    accountNumber: 'AC12312',
                    sortCode: '125322',
                    balance: 5000
                }]
            ])
        },
        {
            id: 125,
            firstName: 'Sharon',
            lastName: 'Tekle',
            email: 'Sharon@gmail.com',
            tel: '07123456',
            address: {
                line1: 'Gibabo House',
                line2: 'Semaetat Avenue',
                postcode: 'ACA123',
                city: 'Asmara'
            },
            accounts: new Map([
                ['AC12315', {
                    id: 534,
                    type: 'CurrentAccount',
                    accountNumber: 'AC12315',
                    sortCode: '125322',
                    balance: 5000
                }]
            ])
        },
        {
            id: 126,
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe23@gmail.com',
            tel: '00317690312526',
            address: {
                line1: 'Harnet Avenue',
                line2: 'Victoria Street',
                postcode: 'KR2-DF',
                city: 'Oslo'
            },
            accounts: new Map([
                ['AC12316', {
                    id: 501,
                    type: 'CurrentAccount',
                    accountNumber: 'AC12316',
                    sortCode: '190429',
                    balance: 7312
                }]
            ])
        }
    ];

  

    function toggleSection(e) {
        let isSectionVisible = false;
        toggleList.forEach(section => {
            if (section.classList.contains(e.target.id)) {
                section.style.display = section.style.display === 'block' ? 'none' : 'block';
                isSectionVisible = section.style.display === 'block';
            } else {
                section.style.display = 'none';
            }
        });
        actionsContainer.style.flexBasis = isSectionVisible ? '200px' : '100px';
    }

    function updateUserInfo(user) {
        if (!user) {
            document.getElementById('fullname').textContent = '';
            document.getElementById('email').textContent = '';
            document.getElementById('tel').textContent = '';
            document.getElementById('address').textContent = '';
            document.getElementById('account-type').textContent = '';
            document.getElementById('sort-code').textContent = '';
            document.getElementById('account-number').textContent = '';
            document.getElementById('balance').textContent = '£0.00';
            return;
        }

        document.getElementById('fullname').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('email').textContent = user.email;
        document.getElementById('tel').textContent = user.tel;
        document.getElementById('address').textContent = `${user.address.line1}, ${user.address.line2}, ${user.address.city}, ${user.address.postcode}`;
        
        const account = user.accounts.values().next().value;
        document.getElementById('account-type').textContent = account.type;
        document.getElementById('sort-code').textContent = account.sortCode;
        document.getElementById('account-number').textContent = account.accountNumber;
        document.getElementById('balance').textContent = `£${account.balance.toFixed(2)}`;
        
        // Update the account options for transfer
        const sourceSelect = document.getElementById('source-account');
        sourceSelect.innerHTML = `<option value="">From</option>`;
        user.accounts.forEach((acc) => {
            sourceSelect.innerHTML += `<option value="${acc.accountNumber}">${acc.accountNumber}</option>`;
        });

        const destinationSelect = document.getElementById('destination-account');
        destinationSelect.innerHTML = `<option value="">To</option>`;
        usersList.forEach((user) => {
            user.accounts.forEach((acc) => {
                destinationSelect.innerHTML += `<option value="${acc.accountNumber}">${acc.accountNumber}</option>`;
            });
        });
    }

    function findUserByAccountNumber(accountNumber) {
        for (const user of usersList) {
            for (const account of user.accounts.values()) {
                if (account.accountNumber === accountNumber) {
                    return user;
                }
            }
        }
        return null;
    }

    function addTransaction(type, amount, source, target) {
        const tableBody = document.getElementById('transactionsTable').querySelector('tbody');
        const row = tableBody.insertRow();
        const dateCell = row.insertCell(0);
        const typeCell = row.insertCell(1);
        const amountCell = row.insertCell(2);
        const sourceCell = row.insertCell(3);
        const targetCell = row.insertCell(4);
        const balanceCell = row.insertCell(5);

        const currentDate = new Date().toLocaleDateString();
        dateCell.textContent = currentDate;
        typeCell.textContent = type;
        amountCell.textContent = `£${amount.toFixed(2)}`;
        sourceCell.textContent = source || 'N/A';
        targetCell.textContent = target || 'N/A';
        balanceCell.textContent = `£${currentUser.accounts.values().next().value.balance.toFixed(2)}`;
    }

    function handleDeposit() {
        const depositAmount = parseFloat(document.getElementById('depositAmount').value);
        if (currentUser && !isNaN(depositAmount) && depositAmount > 0) {
            const account = currentUser.accounts.values().next().value;
            account.balance += depositAmount;
            updateUserInfo(currentUser);
            addTransaction('Deposit', depositAmount, null, account.accountNumber);
        }
    }

    function handleTransfer() {
        const sourceAccountNumber = document.getElementById('source-account').value;
        const targetAccountNumber = document.getElementById('destination-account').value;
        const transferAmount = parseFloat(document.getElementById('amount').value);

        if (sourceAccountNumber && targetAccountNumber && sourceAccountNumber !== targetAccountNumber && !isNaN(transferAmount) && transferAmount > 0) {
            const sourceUser = findUserByAccountNumber(sourceAccountNumber);
            const targetUser = findUserByAccountNumber(targetAccountNumber);
            const sourceAccount = sourceUser.accounts.get(sourceAccountNumber);
            const targetAccount = targetUser.accounts.get(targetAccountNumber);

            if (sourceAccount.balance >= transferAmount) {
                sourceAccount.balance -= transferAmount;
                targetAccount.balance += transferAmount;

                updateUserInfo(currentUser);
                addTransaction('Transfer', transferAmount, sourceAccountNumber, targetAccountNumber);
            } else {
                alert('Insufficient funds for transfer.');
            }
        }
    }

    function handleWithdraw() {
        const withdrawAmount = parseFloat(document.getElementById('withdrawAmount').value);
        if (currentUser && !isNaN(withdrawAmount) && withdrawAmount > 0) {
            const account = currentUser.accounts.values().next().value;
            if (account.balance >= withdrawAmount) {
                account.balance -= withdrawAmount;
                updateUserInfo(currentUser);
                addTransaction('Withdraw', withdrawAmount, account.accountNumber, null);
            } else {
                alert('Insufficient funds for withdrawal.');
            }
        }
    }

    document.querySelector('#deposit').addEventListener('click', toggleSection);
    document.querySelector('#transfer').addEventListener('click', toggleSection);
    document.querySelector('#withdraw').addEventListener('click', toggleSection);
    document.querySelector('#depositSubmit').addEventListener('click', handleDeposit);
    document.querySelector('#transferSubmit').addEventListener('click', handleTransfer);
    document.querySelector('#withdrawSubmit').addEventListener('click', handleWithdraw);
    document.querySelector('#btn-find').addEventListener('click', () => {
        const accountNumber = document.getElementById('search').value.trim(); // Trim whitespace
        const user = findUserByAccountNumber(accountNumber);
        if (user) {
            currentUser = user;
            updateUserInfo(user);
        } else {
            currentUser = null;
            updateUserInfo(null); // Clear the account summary
            alert('User not found.');
        }
    });

    document.querySelector('#btn-all-users').addEventListener('click', () => {
        alert(usersList.map(user => `${user.firstName} ${user.lastName}`).join('\n'));
    });
});
