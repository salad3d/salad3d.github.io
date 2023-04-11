var curr_cats = {
    "gen": "chair",
    "part-completion": "chair",
    "part-mixing": "chair",
    "text-generation": "chair",
    "text-completion": "chair",
}
var numDisplays = {
    "gen": 5,
    "part-completion": 2,
    "part-mixing": 1,
    "text-generation": 6,
    "text-completion": 1,
}
var mesh_indices = {
    "gen-chair": [...Array(53).keys()],
    "gen-table": [...Array(44).keys()],
    "gen-airplane": [...Array(40).keys()],
    "part-completion-chair": [...Array(12).keys()],
    "part-completion-airplane": [...Array(16).keys()],
    "part-mixing-chair": [...Array(22).keys()],
    "part-mixing-airplane": [...Array(14).keys()],
    "text-generation-chair": [...Array(19).keys()],
    "text-completion-chair": [...Array(12).keys()],
}

var sentences = {
    "text-generation": [
        "fat no legs",
        "thin/skinny legs with thin chair arms",
        "curved  solid back",
        "the target has very tiny arms",
        "with a narrow slat across my back",
        "round chair with round back",
        "curved top",
        "oval footrest",
        "wrap around curved back narrow legs",
        "this chair is very tall with skinny legs on it",
        "rounded back",
        "Has an opening in the back of the chair",
        "the one with the oval shaped back",
        "The one that looks most like a lawn chair. Net-like back",
        "dining room chair with fancy holes in back",
        "regular looking back, no arms",
        "5 lines, with curve",
        "its the one with gaps in the back",
        "chair has rounded arms and wheels",
    ],
    "text-completion": [
        "four leg and straight back",
        "straight rectangular back",
        "solid back",
        "four leg and two arm",
        "chair with no arm",
        "swivel leg",
        "solid base and no leg",
        "round seat has arm and circle base",
        "thick leg and arm",
        "circular back",
        "four thin leg",
        "has leg seat back of office chair",
    ],
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function shuffle2(tag = null, cat = null) {
    if(!cat) cat = curr_cats[tag];
    let all_idx = mesh_indices[tag + "-" + cat];
    gtag("event", cat + "_" + tag + "_click", {"time": Date.now(),}); // google analytics

    shuffleArray(all_idx);
    if (tag === "gen") {
        prevBtn = document.getElementById(tag + "-" + curr_cats[tag]).classList.remove(tag + "-btn-select");
        all_idx.map((mesh_idx, i) => {
            if(i >= numDisplays[tag]) return;
            document.getElementById(`${tag}-mesh-${i}`).setAttribute('src',
                `assets/3d_compressed/generation/${cat}/${mesh_idx}.gltf`);
            document.getElementById(`${tag}-gaus-${i}`).setAttribute('src',
                `assets/3d_compressed/generation/${cat}/${mesh_idx}_gaus.gltf`);
        })
        btn = document.getElementById(tag + "-" + cat).classList.add(tag + "-btn-select");
        curr_cats[tag] = cat;
    }
    else if (tag === "part-completion") {
        prevBtn = document.getElementById(tag + "-" + curr_cats[tag]).classList.remove(tag + "-btn-select");
        all_idx.map((mesh_idx, i) => {
            if (i >= numDisplays[tag]) return;
            document.getElementById(`${tag}-src-mesh-${i}`).setAttribute('src',
                `assets/3d_compressed/part_completion/${cat}/${mesh_idx}_src.gltf`);
            document.getElementById(`${tag}-gaus-mesh-${i}`).setAttribute('src',
                `assets/3d_compressed/part_completion/${cat}/${mesh_idx}_gaus.gltf`);
            document.getElementById(`${tag}-0_out-mesh-${i}`).setAttribute('src',
                `assets/3d_compressed/part_completion/${cat}/${mesh_idx}_0_out.gltf`);
            document.getElementById(`${tag}-1_out-mesh-${i}`).setAttribute('src',
                `assets/3d_compressed/part_completion/${cat}/${mesh_idx}_1_out.gltf`);

        })
        btn = document.getElementById(tag + "-" + cat).classList.add(tag + "-btn-select");
        curr_cats[tag] = cat;
    } else if (tag === "part-mixing") {
        prevBtn = document.getElementById(tag + "-" + curr_cats[tag]).classList.remove(tag + "-btn-select");
        all_idx.map((mesh_idx, i) => {
            if (i >= numDisplays[tag]) return;
            filenames = ["doner_gmm", "donee_gmm", "swap_gmm", "refined_gmm", "doner", "donee", "swap", "refined"];
            for (fn of filenames) {
                document.getElementById(`${tag}-${fn}-mesh-${i}`).setAttribute('src',
                    `assets/3d_compressed/part_mixing/${cat}/${mesh_idx}/${fn}.gltf`);

            }
        })
        btn = document.getElementById(tag + "-" + cat).classList.add(tag + "-btn-select");
        curr_cats[tag] = cat;
    } else if (tag === "text-generation") {
        filenames = ["autosdf", "salad"];
        all_idx.map((mesh_idx, i) => {
            if (i > numDisplays[tag]) return;
            for (fn of filenames) {
                console.log(document.getElementById(`${tag}-${fn}-mesh-${i}`))
                document.getElementById(`${tag}-${fn}-mesh-${i}`).setAttribute('src',
                    `assets/3d_compressed/text_generation/${mesh_idx}_${fn}.gltf`);
            }
            document.getElementById(`${tag}-text-${i}`).innerHTML = `"${sentences[tag][mesh_idx]}."`
        })
    } else if (tag == "text-completion") {
        filenames = ["src", "src_gmms", "out", "out_gmms"];
        all_idx.map((mesh_idx, i) => {
            if (i > numDisplays[tag]) return;
            for (fn of filenames) {
                document.getElementById(`${tag}-${fn}-mesh-${i}`).setAttribute('src',
                    `assets/3d_compressed/text_completion/${mesh_idx}_${fn}.gltf`);
            }
            document.getElementById(`${tag}-text-${i}`).innerHTML = `"${sentences[tag][mesh_idx]}."`
        })
       
    }

}

function initialize2(tag) {
    display = document.getElementById(tag+"-content");
    if (tag === "gen") {
        string = "<div class='text-generation-subtitle' style='width: 10%'>Shape</div>\n"
        for (i = 0; i < numDisplays[tag]; i++) {
            string += `<div class='${tag}-entry' id='${tag}-entry-${i}-mesh'>\n`
            + `<model-viewer orientation='0 0 220deg' loading='lazy' id='${tag}-mesh-${i}'`
            + `camera-controls touch-action='pan-y' src='assets/3d_compressed/generation/${curr_cats[tag]}/${i}.gltf'>\n`
            + "</model-viewer>\n"
            + "</div>\n";
        }
        string += "<div class='text-generation-subtitle' style='width: 10%'>Gaussians</div>\n"
        for (i = 0; i < numDisplays[tag]; i++) {
            string += `<div class='${tag}-entry' id='${tag}-entry-${i}-gaus'>\n`
            + `<model-viewer orientation='0 0 220deg' loading='lazy' id='${tag}-gaus-${i}'`
            + `camera-controls touch-action='pan-y' src='assets/3d_compressed/generation/${curr_cats[tag]}/${i}_gaus.gltf'>\n`
            + "</model-viewer>\n"
            + "</div>\n";
        }
        display.innerHTML += string;
    } else if(tag === "part-completion"){
        for (i = 0; i < numDisplays[tag]; i++) {
            display.innerHTML +=
                `<div class='${tag}-entry' id='${tag}-entry-${i}-src'>\n`
                + `<model-viewer orientation='0 0 220deg' loading='lazy' id='${tag}-src-mesh-${i}'`
                + `camera-controls touch-action='pan-y' src='assets/3d_compressed/part_completion/${curr_cats[tag]}/${i}_src.gltf'>\n`
                + "</model-viewer>\n"
                + "</div>\n";
            display.innerHTML +=
                `<div class='${tag}-entry boundary-right' id='${tag}-entry-${i}-gaus'>\n`
                + `<model-viewer orientation='0 0 220deg' loading='lazy' id='${tag}-gaus-mesh-${i}'`
                + `camera-controls touch-action='pan-y' src='assets/3d_compressed/part_completion/${curr_cats[tag]}/${i}_gaus.gltf'>\n`
                + "</model-viewer>\n"
                + "</div>\n";
            display.innerHTML +=
                `<div class='${tag}-entry' id='${tag}-entry-${i}-0_out' style='width: 24%'>\n`
                + `<model-viewer orientation='0 0 220deg' loading='lazy' id='${tag}-0_out-mesh-${i}'`
                + `camera-controls touch-action='pan-y' src='assets/3d_compressed/part_completion/${curr_cats[tag]}/${i}_0_out.gltf'>\n`
                + "</model-viewer>\n"
                + "</div>\n";
            display.innerHTML +=
                `<div class='${tag}-entry' id='${tag}-entry-${i}-1_out' style='width: 24%'>\n`
                + `<model-viewer orientation='0 0 220deg' loading='lazy' id='${tag}-1_out-mesh-${i}'`
                + `camera-controls touch-action='pan-y' src='assets/3d_compressed/part_completion/${curr_cats[tag]}/${i}_1_out.gltf'>\n`
                + "</model-viewer>\n"
                + "</div>\n";
        }
    } else if (tag === "part-mixing") {
        filenames = ["doner", "donee", "swap", "refined", "doner_gmm", "donee_gmm", "swap_gmm", "refined_gmm"];
        string = ""
        for (i = 0; i < numDisplays[tag]; i++) {
            for (j = 0; j < filenames.length; j++) {
                fn = filenames[j];
                if (fn === "swap_gmm" || fn === "swap")
                    string += `<div class='${tag}-entry boundary-right' id='${tag}-entry-${i}-${fn}'>\n`
                else if (fn === "refined_gmm" || fn === "refined")
                    string += `<div class='${tag}-entry' id='${tag}-entry-${i}-${fn}' style='width: 24%'>\n`
                else
                    string += `<div class='${tag}-entry' id='${tag}-entry-${i}-${fn}'>\n`
                string +=
                    `<model-viewer orientation='0 0 220deg' loading='lazy' id='${tag}-${fn}-mesh-${i}'`
                    + `camera-controls touch-action='pan-y' src='assets/3d_compressed/part_mixing/${curr_cats[tag]}/${i}/${fn}.gltf'>\n`
                    + "</model-viewer>\n"
                    + "</div>\n";
            }
        }
        display.innerHTML += string;
    } else if (tag === "text-generation") {
        models = ["autosdf", "salad"];
        string = ""
        for (i = 0; i < numDisplays[tag]; i++) {
            if(i % 2 == 0)
                string += `<div class='text-generation-cell boundary-right'>`;
            else
                string += `<div class='text-generation-cell'>`;

            for (model_name of models) {
                string +=
                    `<div class='${tag}-entry' id='${tag}-entry-${i}-${fn}'>`
                    + `<model-viewer orientation='0 0 220deg' loading='lazy' id='${tag}-${model_name}-mesh-${i}'`
                    + `camera-controls touch-action='pan-y' src='assets/3d_compressed/text_generation/${i}_${model_name}.gltf'>`
                    + "</model-viewer>"
                    + "</div>";

            }
            string += `<div class='text' id='${tag}-text-${i}'>"${sentences[tag][i]}."</div>`
            string += "</div>"
        }
        display.innerHTML += string;

    } else if (tag === "text-completion") {
        filenames = ["src", "src_gmms", "out", "out_gmms"];
        string = ""
        for (i = 0; i < numDisplays[tag]; i++) {
            string += `<div class='text-completion-cell'>`;
            for (fn of filenames) {
                if (fn === "src_gmms")
                    string += `<div class='${tag}-entry boundary-right' id='${tag}-entry-${i}-${fn}'>\n`
                else
                    string += `<div class='${tag}-entry' id='${tag}-entry-${i}-${fn}'>\n`
                string +=
                    `<model-viewer orientation='0 0 220deg' loading='lazy' id='${tag}-${fn}-mesh-${i}'`
                    + `camera-controls touch-action='pan-y' src='assets/3d_compressed/text_completion/${i}_${fn}.gltf'>\n`
                    + "</model-viewer>\n"
                    + "</div>\n";
            }
            string += `<div class='text' id='${tag}-text-${i}'>"${sentences[tag][i]}."</div>`
            string += "</div>"
        }
        
        display.innerHTML += string;
    }
}
