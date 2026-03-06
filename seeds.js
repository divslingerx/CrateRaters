var Record = require("./models/record");
var Comment   = require("./models/comment");

var data = [
    {
        artist: "James Brown",
        album: "James Brown Live At The Appollo",
        image: "http://ring.cdandlp.com/french-connection-records/photo_grande/114770819.jpg",
        year: '1963',
        found: "Drums, Strings, Vocals"
    },
    {
        artist: "Skull Snaps",
        album: "'It's A New Day",
        image: "http://www.popsike.com/pix/20060912/140028511643.jpg",
        year: '1973',
        found: "Drums, Strings, Vocals"
    },
    {
        artist: "The Honey Drippers",
        album: "Impeach The President",
        image: "https://vinylstylus.files.wordpress.com/2012/08/the-honey-drippers-volume-one.jpg",
        year: '1963',
        found: "Drums, Strings, Vocals"
    }
];

async function seedDB(){
    try {
        await Record.deleteMany({});
        console.log("removed records!");
        for (var seed of data) {
            var record = await Record.create(seed);
            console.log("added a record");
            var comment = await Comment.create({
                text: "This place is great, but I wish there was internet",
                author: "Homer"
            });
            record.comments.push(comment);
            await record.save();
            console.log("Created new comment");
        }
    } catch(err) {
        console.log(err);
    }
}

module.exports = seedDB;
