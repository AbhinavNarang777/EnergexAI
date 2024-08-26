from fastapi import APIRouter, Depends, HTTPException, status, Request
from utilities.logging import CustomLog
from helper.time_prediction import TimePrediction
from constants import ANALYTICS_STR, PREDICTION_DATASET
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import pandas as pd
from utilities.custom_lib import get_current_row, get_date
from schemas.analytics.time_series import (
    PredictRequest,
    ActualDataRequest,
)


router = APIRouter(
    prefix=ANALYTICS_STR,
    tags=['Analytics'],
)

@router.post(
    "/predict",
)
def predict_series(
    request: Request,
    form_data: PredictRequest,
):
    try:
        predictor = TimePrediction()

        df = pd.read_excel(PREDICTION_DATASET)
        df = df[['datetime', 'demand']]
        current_row = get_current_row(df=df)

        sorted_train, sorted_test = predictor.load_and_preprocess_data(
            df=df,
            train_slice=slice(current_row-700, current_row),
            test_slice= slice(current_row+1, current_row+form_data.num_predict),
            )
        out = predictor.run_predictions(sorted_train, sorted_test)
        result_df = out['LLMTime GPT-4']['median']

        df_slice = df[current_row-24:current_row+1]
        actual_result = {row["datetime"]: row["demand"] for index, row in df_slice.iterrows()}

        return JSONResponse(
            content=jsonable_encoder({
                "actual": actual_result,
                "predicted": result_df.to_dict(),
                "corrected": {}
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
    "/get_actual_demand",
)
def get_actual_demand(
    request: Request,
    form_data: ActualDataRequest,
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
        return JSONResponse(
            content=jsonable_encoder({"demand": df.iloc[[current_row]]["demand"].item()}),
            status_code=status.HTTP_200_OK
        )

    except Exception as e:
        log = CustomLog(request)
        # log.print_log({str(e)}, level="error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    

@router.get(
    "/get_forecast",
)
def get_forecast(
    request: Request,
):
    try:
        df = pd.read_excel(PREDICTION_DATASET)
        output_format = {
            "date": df["datetime"].to_list(),
            "green": df["green_energy"].to_list(),
            "non_green": df["non_green_energy"].to_list()
        }

        return JSONResponse(
            content=jsonable_encoder(output_format),
            status_code=status.HTTP_200_OK
        )

    except Exception as e:
        log = CustomLog(request)
        # log.print_log({str(e)}, level="error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
