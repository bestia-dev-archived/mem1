// An attribute to hide warnings for unused code.
//#![allow(dead_code)]

use dodrio::bumpalo::{self, Bump};
use dodrio::{Node, Render};

use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

use rand::seq::SliceRandom;
use rand::{thread_rng, Rng};

enum CardFaceStatus {
    Down,
    UpTemporary,
    UpPermanently,
}

struct Card {
    status: CardFaceStatus,
    //src attribute for HTML element image
    src_as_image_source: String,
    //id attribute for HTML element image contains the card index
    id_as_card_index: String,
}

const SRC_FOR_CARD_FACE_DOWN: &str = "content/mem_image_closed.png";

struct CardGrid {
    vec_cards: Vec<Card>,
    //The player in one turn clicks 2 times and open 2 cards. If not match,
    //the third click closes opened cards and
    //it starts the next player turn.
    count_click_inside_one_turn: i16,
    card_index_of_first_click: usize,
    card_index_of_second_click: usize,
    //counts only clicks that flip the card. The third click is not counted.
    count_all_clicks: i16,
}

impl CardGrid {
    /// Construct a new `CardGrid` component.
    fn new() -> CardGrid {
        let mut vec_of_random_numbers = Vec::new();
        //find 8 distinct random numbers between 1 and 26 for the alphabet cards
        let mut rng = rand::thread_rng();
        let mut i = 0;

        while i < 8 {
            //gen_range is lower inclusive, upper exclusive
            let num: i16 = rng.gen_range(1, 26 + 1);
            if dbg!(vec_of_random_numbers.contains(&num)) {
                //do nothing if the random number is repeated
                dbg!(num);
            } else {
                //push a pair of the same number
                vec_of_random_numbers.push(num);
                vec_of_random_numbers.push(num);
                i += 1;
            }
        }

        //shuffle the numbers
        let vrndslice = vec_of_random_numbers.as_mut_slice();
        vrndslice.shuffle(&mut thread_rng());

        //create Cards from random numbers
        dbg!("vec_of_random_numbers values");
        let mut vec_card_from_random_numbers = Vec::new();
        for (index, random_number) in vec_of_random_numbers.iter().enumerate() {
            let src = format!("content/mem_image_{:02}.png", random_number);
            dbg!(&src);
            let new_card = Card {
                status: CardFaceStatus::Down,
                src_as_image_source: src,
                id_as_card_index: format!("img{}", index),
            };
            vec_card_from_random_numbers.push(new_card);
        }
        //return from constructor
        CardGrid {
            vec_cards: vec_card_from_random_numbers,
            count_click_inside_one_turn: 0,
            card_index_of_first_click: 0,
            card_index_of_second_click: 0,
            count_all_clicks: 0,
        }
    }
}

// The `Render` implementation. It is called for every Dodrio animation frame to render the vdom.
impl Render for CardGrid {
    fn render<'a, 'bump>(&'a self, bump: &'bump Bump) -> Node<'bump>
    where
        'a: 'bump,
    {
        use dodrio::builder::*;
        //the card grid is a flex table object defined in css with <img> inside
        //we first prepare the flex_col with image, then push them in flex_row
        //and finaly push them in <div>

        let mut vec_flex_row_bump = Vec::new();
        for x in 1..5 {
            let mut vec_flex_col_bump = Vec::new();
            for y in 1..5 {
                let index = (x - 1) * 4 + y - 1;
                let src = match self.vec_cards[index].status {
                    CardFaceStatus::Down => SRC_FOR_CARD_FACE_DOWN,
                    CardFaceStatus::UpTemporary => {
                        self.vec_cards[index].src_as_image_source.as_str()
                    }
                    CardFaceStatus::UpPermanently => {
                        self.vec_cards[index].src_as_image_source.as_str()
                    }
                };
                let id = self.vec_cards[index].id_as_card_index.as_str();
                let flex_col_bump = div(bump)
                    .attr("class", "m_flex_col")
                    .children([img(bump)
                        .attr("src", src)
                        .attr("id", id)
                        //on click needs a code Closure in Rust. Dodrio and wasm-bindgen
                        //generate the javascript code to call it properly.
                        .on("click", |root, vdom, event| {
                            // If the event's target is our image...
                            let img = match event
                                .target()
                                .and_then(|t| t.dyn_into::<web_sys::HtmlImageElement>().ok())
                            {
                                None => return,
                                //?? Don't understand what this does. The original was written for Input element.
                                Some(input) => input,
                            };
                            //we need our Struct CardGrid for Rust to write something.
                            //It comes in the parameter root.
                            //All we have to change is the CardGrid fields.
                            //The method render will later use that for rendering the new html.
                            let card_grid = root.unwrap_mut::<CardGrid>();
                            //we have 3 possible clicks in one turn with different code branches.
                            if card_grid.count_click_inside_one_turn >= 2 {
                                //third click closes first and second card
                                card_grid.vec_cards[card_grid.card_index_of_first_click].status =
                                    CardFaceStatus::Down;
                                card_grid.vec_cards[card_grid.card_index_of_second_click].status =
                                    CardFaceStatus::Down;
                                card_grid.count_click_inside_one_turn = 0;
                            } else {
                                //id attribute of image html element is prefixed with img ex. "img12"
                                let this_click_card_index =
                                    (img.id()[3..]).parse::<usize>().unwrap();

                                match card_grid.vec_cards[this_click_card_index].status {
                                    //if card facedown, flip it
                                    CardFaceStatus::Down => {
                                        card_grid.vec_cards[this_click_card_index].status =
                                            CardFaceStatus::UpTemporary;
                                        if card_grid.count_click_inside_one_turn == 0 {
                                            //if is first click, just count the clicks
                                            card_grid.card_index_of_first_click =
                                                this_click_card_index;
                                            card_grid.count_click_inside_one_turn += 1;
                                            card_grid.count_all_clicks += 1;
                                        } else if card_grid.count_click_inside_one_turn == 1 {
                                            //if is second click, flip the card and then check for card match
                                            card_grid.card_index_of_second_click =
                                                this_click_card_index;
                                            card_grid.count_click_inside_one_turn += 1;
                                            card_grid.count_all_clicks += 1;
                                            //if the cards match, we don't need the third click
                                            if card_grid.vec_cards
                                                [card_grid.card_index_of_first_click]
                                                .src_as_image_source
                                                == card_grid.vec_cards
                                                    [card_grid.card_index_of_second_click]
                                                    .src_as_image_source
                                            {
                                                // the two cards matches. make them permanent FaceUp
                                                card_grid.vec_cards
                                                    [card_grid.card_index_of_first_click]
                                                    .status = CardFaceStatus::UpPermanently;
                                                card_grid.vec_cards
                                                    [card_grid.card_index_of_second_click]
                                                    .status = CardFaceStatus::UpPermanently;
                                                card_grid.count_click_inside_one_turn = 0;
                                            }
                                        }
                                    }
                                    //do nothing if player clicks the faceUp cards
                                    CardFaceStatus::UpTemporary => (),
                                    CardFaceStatus::UpPermanently => (),
                                };
                            }

                            // Finally, re-render the component on the next animation frame.
                            vdom.schedule_render();
                        })
                        .finish()])
                    .finish();
                vec_flex_col_bump.push(flex_col_bump);
            }
            let flex_row_bump = div(bump)
                .attr("class", "m_flex_row")
                .children(vec_flex_col_bump)
                .finish();
            vec_flex_row_bump.push(flex_row_bump);
        }

        //create the virtual dom
        div(bump)
            //using w3.css
            .attr("class", "m_container")
            .children([
                h1(bump)
                    .children([text(bumpalo::format!(in bump, "mem1{}","").into_bump_str())])
                    .finish(),
                //the card grid is a flex table object defined in css with <img> inside
                div(bump)
                    .attr("style", "margin-left: auto;margin-right: auto;")
                    .children(vec_flex_row_bump)
                    .finish(),
                h3(bump)
                    .children([text(
                        bumpalo::format!(in bump, "Count of Clicks: {}", self.count_all_clicks)
                            .into_bump_str(),
                    )])
                    .finish(),
                h4(bump)
                    //multiline string literal in Rust
                    .children([text(
                        bumpalo::format!(in bump, "This is a programming example for Rust Webassembly Virtual Dom application. \
                        The simple memory game is for kids. The images are funny cartoon characters from the alphabet. \
                        The cards grid is only 4x4. {}", "").into_bump_str(),
                    )])
                    .finish(),
                h2(bump)
                    .children([text(
                        bumpalo::format!(in bump, "Memory game rules: {}", "").into_bump_str(),
                    )])
                    .finish(),
                h4(bump)
                    //multiline string literal in Rust
                    .children([text(
                        bumpalo::format!(in bump, "For the sake of simplicity, the first iteration is made as single player mode. \
The game starts with a grid of 8 randomly shuffled card pairs face down - 16 cards in all. \
The player flips over two cards with two clicks. \
If the cards do not match, the player starts a new turn with a click to turn both cards back face down. Then two clicks to flip over two cards. \
If the cards match, they are left face up and the player continues with the next turn. No additional third click needed in that case. \
The Count of clicks can be used as score. The lower the Count, the better score it is.{}", "").into_bump_str(),
                    )])
                    .finish(),
                h6(bump)
                    .children([
                        text(bumpalo::format!(in bump, "Learning Rust programming: {}", "").into_bump_str(),),
                        a(bump)
                            .attr("href", "https://github.com/LucianoBestia/mem1")
                            .attr("target","_blank")
                            .children([text(bumpalo::format!(in bump, "https://github.com/LucianoBestia/mem1{}", "").into_bump_str(),)])
                            .finish(),
                    ])
                    .finish(),
            ])
            .finish()
    }
}

#[wasm_bindgen(start)]
pub fn run() {
    // Initialize debugging for when/if something goes wrong.
    console_error_panic_hook::set_once();

    // Get the document's `<body>`.
    let window = web_sys::window().unwrap();
    let document = window.document().unwrap();
    let body = document.body().unwrap();

    // Construct a new `CardGrid` rendering component.
    let card_grid = CardGrid::new();

    // Mount the component to the `<body>`.
    let vdom = dodrio::Vdom::new(&body, card_grid);

    // Run the component forever.
    vdom.forget();
}
