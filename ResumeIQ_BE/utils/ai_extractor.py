import json
import os

from openai import OpenAI

# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY is not set")

    return OpenAI(api_key=api_key)


client = get_openai_client()


def clean_llm_output(result):
    result = result.strip()

    if result.startswith("```"):
        result = result.replace("```json", "").replace("```", "").strip()

    return result


def extract_skills_ai(text):
    prompt = f"""
     Extract:
     1. Name
     2. Email
     3. Phone
     4. Technical skills
     5. Years of experience

     Return JSON:
     {{
         "name": "John Doe",
         "email": "john@email.com",
         "phone": "9876543210",
         "technical_skills": ["Python", "React"],
         "years_of_experience": 3
     }}

     Resume:
     {text}
     """

    response = client.chat.completions.create(
        model="gpt-4o-mini", messages=[{"role": "user", "content": prompt}]
    )

    result = response.choices[0].message.content
    cleaned = clean_llm_output(result)

    try:
        return json.loads(cleaned)
    except:
        return {"technical_skills": [], "years_of_experience": 0}


def parse_query(query: str):
    try:
        prompt = f"""
        Extract structured filters from this query.

        Return JSON:
        {{
            "skills": ["Angular", "Python"],
            "min_experience": 5
        }}

        Query: {query}
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            timeout=5,  # ⏱️ prevent long wait
        )

        result = response.choices[0].message.content
        result = result.replace("```json", "").replace("```", "").strip()
        print(response.choices[0].message.content)

        return json.loads(result)

    except Exception as e:
        print("AI failed, fallback:", e)

        # ✅ fallback (VERY IMPORTANT)
        return {"skills": [query], "min_experience": 0}  # treat full query as keyword
