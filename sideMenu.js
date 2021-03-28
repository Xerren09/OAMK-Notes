let pageContainer = document.querySelector('#pageContainer');
let sideMenuButton = document.querySelector('#sideMenuButton');
let sideMenu = document.querySelector('#sideMenu');

sideMenuButton.onclick = () => {
    if (sideMenu.className == 'hidden') {
        sideMenuButton.style.right = '600%';
        sideMenu.style.left = '87%'
        sideMenu.classList.remove('hidden');
        sideMenu.classList.add('visible');
    } else {
        sideMenuButton.style.right = '0%';
        sideMenu.style.left = '100%'
        sideMenu.classList.remove('visible');
        sideMenu.classList.add('hidden');
    }
}