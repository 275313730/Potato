const modules = ['Sprite', 'Stage']
modules.forEach(module => {
    document.write(`<script src="modules/${module}.js"></script>`)
})

const sprites = ['BackGround', 'Camera']
sprites.forEach(sprite => {
    document.write(`<script src="src/sprites/${sprite}.js"></script>`)
})

const events = []
events.forEach(event => {
    document.write(`<script src="src/events/${event}.js"></script>`)
})

document.write(`<script src="App.js"></script>`)