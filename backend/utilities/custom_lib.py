import re
import json
import pandas as pd
from datetime import datetime


def post_process_response(text):
    pattern = r'([^\w\s]*)(:myTag|:myTAG)\[(\d+)\]([^\w\s]*)(?:\s*(-)\s*\[.*?\])*'

    def replace_func(match):
        preceding_char = match.group(1)
        following_char = match.group(4)

        if preceding_char not in [' ', ''] or following_char not in [
            ' ',
            '',
            '.',
            ',',
            '!',
            '?',
            ':',
            ';',
            ')',
        ]:
            preceding_char = ''
        if following_char not in [' ', '', '.', ',', '!', '?', ':', ';', '(']:
            following_char = ''
        
        return f'{preceding_char}{match.group(2)}[{match.group(3)}]{following_char}'

    processed_text = re.sub(pattern, replace_func, text)
    is_changed = text != processed_text
    return processed_text, is_changed

def get_current_row(df: pd.DataFrame, year=2018, month=3, day=15, hour=datetime.now().hour):
    df['datetime'] = pd.to_datetime(df['datetime'])

    target_datetime = datetime(
        year=year,
        month=month,
        day=day,
        hour=hour,
        minute=0,
        second=0,
        microsecond=0
        )
    matching_row = df[df['datetime'] == target_datetime]
    return matching_row.index[0]


def get_date(date: str):
    date_obj = datetime.strptime(date, "%Y-%m-%dT%H:%M:%S")

    year = date_obj.year
    month = date_obj.month
    day = date_obj.day
    hour = date_obj.hour

    return year, month, day, hour

def parse_correction(input_str: str):
    start = input_str.rfind('```json') + len('```json\n')
    end = input_str.rfind('```\n') if input_str.rfind('```\n') != -1 else input_str.rfind('```')
    json_str = input_str[start:end].strip()

    corrected_pred_data = json.loads(json_str)
    corrected_pred = corrected_pred_data["corrected_pred"]
    return corrected_pred