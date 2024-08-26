import os
import pandas as pd
from services.llmtime.utils import grid_iter
from services.llmtime.serialize import SerializerSettings
from services.llmtime.llmtime import get_llmtime_predictions_data
from services.llmtime.validation_likelihood_tuning import get_autotuned_predictions_data


os.environ['OMP_NUM_THREADS'] = '4'
class TimePrediction:
    def __init__(self):
        self.gpt4_hypers = dict(
            alpha=0.3,
            basic=True,
            temp=1.0,
            top_p=0.8,
            settings=SerializerSettings(base=10, prec=3, signed=True, time_sep=', ', bit_sep='', minus_sign='-')
        )

        # self.gpt3_hypers = dict(
        #     temp=0.95,
        #     alpha=0.5,
        #     beta=0.3,
        #     top_p=0.3,
        #     basic=False,
        #     settings=SerializerSettings(base=10, prec=3, signed=True, half_bin_correction=True)
        # )

        self.model_hypers = {
            'LLMTime GPT-4': {'model': 'gpt-4-1106-preview', **self.gpt4_hypers},
            # 'LLMTime GPT-3.5': {'model': 'gpt-3.5-turbo-1106', **gpt3_hypers},
        }

        self.model_predict_fns = {
            'LLMTime GPT-4': get_llmtime_predictions_data,
            # 'LLMTime GPT-3.5': get_llmtime_predictions_data,
        }

        self.model_names = list(self.model_predict_fns.keys())

    def get_datasets_trim(self, df_trim, testfrac=0.2):
        splitpoint = int(len(df_trim)*(1-testfrac))
        train = df_trim.iloc[:splitpoint].copy()
        test = df_trim.iloc[splitpoint:].copy()
        return [train, test]

    def squeeze_dataset(self, df):
        temp = dict(zip(df.iloc[:, 0], df.iloc[:, 1]))
        data = pd.DataFrame(temp.values(), index=temp.keys())
        my_series = data.squeeze()
        sorted_df = my_series.sort_index()
        return sorted_df

    def load_and_preprocess_data(self, df: pd.DataFrame, train_slice=slice(0, 700), test_slice=slice(700, 1200)):
        df_train = df[train_slice]
        df_test = df[test_slice]

        sorted_train = self.squeeze_dataset(df=df_train)
        sorted_test = self.squeeze_dataset(df=df_test)
        return sorted_train, sorted_test

    def run_predictions(self, sorted_train, sorted_test):
        out = {}
        for model in self.model_names:
            hypers = list(grid_iter(self.model_hypers[model]))
            num_samples = 10
            pred_dict = get_autotuned_predictions_data(sorted_train, sorted_test, hypers, num_samples, self.model_predict_fns[model], verbose=False, parallel=False)
            out[model] = pred_dict
        return out