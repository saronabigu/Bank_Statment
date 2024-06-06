document.querySelectorAll('.toggle').forEach(section => {
    section.style.display = 'none';
});

let toggleList = document.querySelectorAll('.toggle');
let actionsContainer = document.querySelector('.account-actions');

function toggleSection(e) {
    let isSectionVisible = false;
    toggleList.forEach(section => {
        if (section.classList.contains(e.target.id)) {
            section.style.display = section.style.display === 'block' ? 'none' : 'block';
            if (section.style.display === 'block') {
                isSectionVisible = true;
            }
        } else {
            section.style.display = 'none';
        }
    });
    actionsContainer.style.flexBasis = isSectionVisible ? '200px' : '100px';
}

document.querySelector('#deposit').addEventListener('click', toggleSection);
document.querySelector('#transfer').addEventListener('click', toggleSection);
document.querySelector('#withdraw').addEventListener('click', toggleSection);

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
            [
                'AC12345',
            {
                id: 321,
                type: 'CurrentAccount',
                accountNumber: 'AC12345',
                sortCode: '110022',
                balance: 10547
            }
        ]
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
            [
                'AC12312',
            {
                id: 543,
                type: 'CurrentAccount',
                accountNumber: 'AC12312',
                sortCode: '125322',
                balance: 5000
            }
        ]
        ])
    },
    {
        id: 125,
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
            [
                'AC262048',
            {
                id: 501,
                type: 'CurrentAccount',
                accountNumber: 'AC262048',
                sortCode: '190429',
                balance: 7312
            }
        ]
        ])
    },
     {
        id: 126,
        firstName: 'Adam',
        lastName: 'Chris',
        email: 'adamch@gmail.com',
        tel: '0029175254705503',
        address: {
            line1: ' Gibabo House',
            line2: 'Semaetat Avenue',
            postcode: 'AS24',
            city: 'Asmara'
        },
        accounts: new Map([
            [
                'AC12301',
            {
                id: 116,
                type: 'CurrentAccount',
                accountNumber: 'AC12301',
                sortCode: '29125321',
                balance: 13917
            }
        ]
        ])
    }
];

const displayUserInfo = (user) => {
    document.getElementById('fullname').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('email').textContent = user.email;
    document.getElementById('tel').textContent = user.tel;
    document.getElementById('address').innerHTML = `${user.address.line1}<br>${user.address.line2}<br>${user.address.postcode}<br>${user.address.city}`;
    const account = Array.from(user.accounts.values())[0];
    document.getElementById('balance').textContent = `£${account.balance}`;
    document.getElementById('account-type').textContent = account.type;
    document.getElementById('sort-code').textContent = account.sortCode;
    document.getElementById('account-number').textContent = account.accountNumber;
};

const findUserByAccountNumber = (accountNumber) => {
    for (let user of usersList) {
        if (user.accounts.has(accountNumber)) {
            return user;
        }
    }
    return null;
};

document.querySelector('.btn-find').addEventListener('click', () => {
    const accountNumber = document.getElementById('search').value;
    const user = findUserByAccountNumber(accountNumber);
    if (user) {
        displayUserInfo(user);
    } else {
        alert('Account not found');
    }
});

document.querySelector('#depositBtn').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    const accountNumber = document.getElementById('account-number').textContent;
    const user = findUserByAccountNumber(accountNumber);
    if (user && amount > 0) {
        const account = user.accounts.get(accountNumber);
        account.balance += amount;
        displayUserInfo(user);
        document.getElementById('depositAmount').value = '';
        alert('Deposit successful');
    } else {
        alert('Invalid deposit amount');
    }
});

document.querySelector('#transeferBtn').addEventListener('click', () => {
    const sourceAccountNumber = document.getElementById('source-account').value;
    const destinationAccountNumber = document.getElementById('destination-account').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const sourceUser = findUserByAccountNumber(sourceAccountNumber);
    const destinationUser = findUserByAccountNumber(destinationAccountNumber);

    if (sourceUser && destinationUser && amount > 0 && sourceAccountNumber !== destinationAccountNumber) {
        const sourceAccount = sourceUser.accounts.get(sourceAccountNumber);
        const destinationAccount = destinationUser.accounts.get(destinationAccountNumber);
        if (sourceAccount.balance >= amount) {
            sourceAccount.balance -= amount;
            destinationAccount.balance += amount;
            displayUserInfo(sourceUser);
            document.getElementById('amount').value = '';
            alert('Transfer successful');
        } else {
            alert('Insufficient balance');
        }
    } else {
        alert('Invalid transfer details');
    }
});

document.querySelector('#withdrawBtn').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const accountNumber = document.getElementById('account-number').textContent;
    const user = findUserByAccountNumber(accountNumber);
    if (user && amount > 0) {
        const account = user.accounts.get(accountNumber);
        if (account.balance >= amount) {
            account.balance -= amount;
            displayUserInfo(user);
            document.getElementById('withdrawAmount').value = '';
            alert('Withdrawal successful');
        } else {
            alert('Insufficient balance');
        }
    } else {
        alert('Invalid withdrawal amount');
    }
});
