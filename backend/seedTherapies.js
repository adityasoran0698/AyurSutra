const mongoose = require("mongoose");
const Therapy = require("./models/Therapy.js");

const MONGO_URI = "mongodb://localhost:27017/ayursutra";

// List of major Ayurvedic therapies with instructions
const therapies = [
  {
    name: "Vamana (Therapeutic Emesis)",
    description: "Detoxifies the body by expelling excess Kapha.",
    duration: 7,
    price: 5000,
    instructions: {
      pre: [
        "Fast overnight before session",
        "Avoid dairy and heavy food a day prior",
        "Wake up early for therapy",
        "Drink warm water in the morning",
        "Avoid stress before session",
        "Take light khichdi night before",
        "Avoid alcohol and smoking",
      ],
      post: [
        "Rest completely for 6 hours",
        "Sip warm water frequently",
        "Avoid oily and spicy food",
        "Eat light vegetarian meals",
        "Do not sleep during the day",
        "Avoid exposure to cold wind",
        "Take herbal teas for digestion",
      ],
    },
  },
  {
    name: "Virechana (Therapeutic Purgation)",
    description: "Cleanses Pitta dosha and improves digestion.",
    duration: 10,
    price: 6000,
    instructions: {
      pre: [
        "Consume ghee as advised before session",
        "Avoid junk food",
        "Light diet 24 hours before procedure",
        "Sleep early before therapy day",
        "Stay hydrated with warm water",
        "Avoid sexual activity before therapy",
        "Practice mild yoga",
        "Avoid cold food before therapy",
        "Take prescribed Ayurvedic herbs",
        "Do not skip breakfast",
      ],
      post: [
        "Eat easily digestible meals",
        "Stay hydrated with herbal teas",
        "Avoid sun exposure for 24 hours",
        "Do not consume fried food",
        "Take complete rest",
        "Avoid travelling long distances",
        "Consume buttermilk",
        "Avoid strenuous activities",
        "Eat small portions frequently",
        "Take light walk in evening",
      ],
    },
  },
  {
    name: "Basti (Therapeutic Enema)",
    description: "Balances Vata, effective for arthritis and constipation.",
    duration: 5,
    price: 4000,
    instructions: {
      pre: [
        "Come with light stomach",
        "Avoid milk before therapy",
        "Avoid cold food and drinks",
        "Do mild stretching",
        "Empty bladder before session",
      ],
      post: [
        "Take warm bath after therapy",
        "Eat easily digestible food",
        "Avoid heavy exercises",
        "Stay indoors and warm",
        "Drink ginger tea for digestion",
      ],
    },
  },
  {
    name: "Nasya (Nasal Administration)",
    description: "Improves breathing and mental clarity.",
    duration: 3,
    price: 2500,
    instructions: {
      pre: [
        "Avoid food 2 hours before session",
        "Clean nasal passage",
        "Do mild facial massage",
      ],
      post: [
        "Do not sleep immediately",
        "Avoid exposure to cold air",
        "Drink warm water",
      ],
    },
  },
  {
    name: "Raktamokshana (Bloodletting)",
    description: "Purifies blood, treats eczema and psoriasis.",
    duration: 2,
    price: 3000,
    instructions: {
      pre: [
        "Do not eat 4 hours before session",
        "Stay hydrated with plain water",
      ],
      post: [
        "Apply antiseptic on puncture site",
        "Avoid heavy exercise for 24 hours",
      ],
    },
  },
];

// 🆕 Function to generate sessions with notifications
function generateSessions(duration, instructions) {
  const sessions = [];
  for (let i = 1; i <= duration; i++) {
    sessions.push({
      day: i,
      notifications: [
        {
          type: "pre-procedure",
          message: instructions.pre[(i - 1) % instructions.pre.length],
        },
        {
          type: "post-procedure",
          message: instructions.post[(i - 1) % instructions.post.length],
        },
      ],
    });
  }
  return sessions;
}

async function seedTherapies() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");

    await Therapy.deleteMany();
    console.log("🗑️ Existing therapies deleted");

    // Add sessions to each therapy before inserting
    const enrichedTherapies = therapies.map((t) => ({
      ...t,
      sessions: generateSessions(t.duration, t.instructions),
    }));

    await Therapy.insertMany(enrichedTherapies);
    console.log(
      "✅ Ayurvedic therapies with sessions & notifications inserted"
    );

    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error seeding therapies:", error);
    mongoose.disconnect();
  }
}

seedTherapies();
