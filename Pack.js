const modules = ['Canvas', 'KeyBoard', 'Engine', 'Sprite', 'Stage']
modules.forEach(module => {
    document.write(`<script src="modules/${module}.js"></script>`)
})

const units = ['Player', 'Star']
units.forEach(unit => {
    document.write(`<script src="src/units/${unit}.js"></script>`)
})

const events = ['CreateStar']
events.forEach(event => {
    document.write(`<script src="src/events/${event}.js"></script>`)
})

document.write(`<script src="App.js"></script>`)