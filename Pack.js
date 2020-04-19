const modules = ['Game', 'Stage', 'Sprite']
modules.forEach(module => {
    document.write(`<script src="modules/${module}.js"></script>`)
})

const stages = ['Start','Static']
stages.forEach(stage => {
    document.write(`<script src="src/stages/${stage}.js"></script>`)
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