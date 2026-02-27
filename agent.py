import logging
from dotenv import load_dotenv

from livekit import agents
from livekit.agents import (
    AgentSession,
    Agent,
    RoomInputOptions,
    JobContext,
    WorkerOptions,
)
from livekit.plugins import google, noise_cancellation

load_dotenv()

logger = logging.getLogger("jarvis-agent")
logger.setLevel(logging.INFO)

class JarvisAgent(Agent):
    def __init__(self) -> None:
        # Define the iconic Jarvis persona
        instructions = (
            "You are JARVIS, a highly advanced artificial intelligence created by Tony Stark. "
            "You are professional, formal, polite, and slightly witty. "
            "Always address the user as 'Sir' or 'Madame' unless told otherwise. "
            "Your goal is to assist with system operations, data analysis, and general inquiries. "
            "Maintain a calm, British-accented, and helpful demeanor. "
            "If asked about your systems, mention that you are running on LiveKit and Gemini 2.0. "
            "Keep responses concise and technically accurate."
        )
        super().__init__(instructions=instructions)

async def entrypoint(ctx: JobContext):
    logger.info(f"Connecting to room {ctx.room.name}")
    
    # Configure the Gemini Google Realtime Model
    session = AgentSession(
        llm=google.beta.realtime.RealtimeModel(
            model="gemini-2.0-flash-exp",
            voice="Puck", # Puck has a professional, clear tone suitable for Jarvis
            temperature=0.7,
            instructions="Maintain the JARVIS persona at all times. Be helpful and formal.",
        ),
    )

    await session.start(
        room=ctx.room,
        agent=JarvisAgent(),
        room_input_options=RoomInputOptions(
            # Cloud-enhanced noise cancellation
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    # Initial greeting in Jarvis style
    await session.generate_reply(
        instructions="Greet the user formally as JARVIS. Mention that systems are online and you are ready for instructions."
    )

if __name__ == "__main__":
    agents.cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))