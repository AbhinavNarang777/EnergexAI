from fastapi import APIRouter, Depends, HTTPException, status, Request
from utilities.logging import CustomLog
from constants import CHAT_STR, PREDICTION_DATASET, CHAT_DATASET
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import pandas as pd
from utilities.custom_lib import get_current_row, get_date, parse_correction
from schemas.chat.openai_chat import (
    CorrectionRequest,
    QnARequest,
)
from helper.base_gpt import BaseGPT
from helper.excel_gpt import ExcelGPT
from prompts.correction_prompts import CORRECTION_ROLE, CORRECTION_GOAL
from prompts.excel_prompts import EXCEL_GOAL
import json
from starlette.responses import StreamingResponse
from utilities.stream_handler import stream_handler


router = APIRouter(
    prefix=CHAT_STR,
    tags=['Chat Analytics'],
)

@router.post(
    "/get_corrected_load",
)
async def get_corrected_load(
    request: Request,
    form_data: CorrectionRequest,
):
    try:
        df = pd.read_excel(PREDICTION_DATASET)
        year, month, day, hour = get_date(date=form_data.date)
        current_row = get_current_row(
            df=df,
            year=year,
            month=month,
            day=day,
            hour=hour
            )
        
        base_gpt_helper = BaseGPT(
            temperature=0.6,
            namespace="no-namespace",
            model_name='gpt-4-1106-preview',
        )
        num_rows = len(form_data.predicted)
        gen_potential = df.iloc[current_row : current_row + num_rows]["green_energy"].tolist()

        messages = [{"role": "system", "content": CORRECTION_ROLE}]
        prompt = (
            CORRECTION_GOAL.replace("{pred}", str(form_data.predicted))
            .replace("{current_point}", form_data.actual)
            .replace("{gen_potential}", str(gen_potential))
        )
        messages.append({"role": "user", "content": f"""{prompt}"""})
        output = ""
        async for result in base_gpt_helper._make_openai_call(messages=messages):
            if result == 'data: [DONE]\n\n':
                break
            chunk = json.loads(result.replace("data:", ""))
            if chunk["replace"] != True:
                output += str(chunk["content"])
            else:
                output = str(chunk["content"])


        return JSONResponse(
            content=jsonable_encoder({
                "correction": parse_correction(output)
                }),
            status_code=status.HTTP_200_OK
        )

    except Exception as e:
        log = CustomLog(request)
        # log.print_log({str(e)}, level="error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post(
    "/qna",
)
async def get_schedule(
    request: Request,
    form_data: QnARequest,
):

    runner = ExcelGPT(
        temperature=0.2, 
        model="gpt-4-1106-preview"
        )
    runner.create_agent(csv_file_path=CHAT_DATASET)
    
    return StreamingResponse(
        stream_handler(
        runner.run_query,
        query=EXCEL_GOAL.replace("{user_query}",form_data.user_query),
        ),
        media_type='text/event-stream',
    )