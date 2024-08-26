from functools import partial
from services.llmtime.gpt import gpt_completion_fn, gpt_nll_fn
from services.llmtime.gpt import tokenize_fn as gpt_tokenize_fn


completion_fns = {
    'text-davinci-003': partial(gpt_completion_fn, model='text-davinci-003'),
    'gpt-4': partial(gpt_completion_fn, model='gpt-4'),
    'gpt-4-1106-preview':partial(gpt_completion_fn, model='gpt-4-1106-preview'),
    'gpt-3.5-turbo-instruct': partial(gpt_completion_fn, model='gpt-3.5-turbo-instruct'),
    'gpt-3.5-turbo-1106': partial(gpt_completion_fn, model='gpt-3.5-turbo-1106'),
}

nll_fns = {
    'text-davinci-003': partial(gpt_nll_fn, model='text-davinci-003'),
}
tokenization_fns = {
    'text-davinci-003': partial(gpt_tokenize_fn, model='text-davinci-003'),
    'gpt-3.5-turbo-instruct': partial(gpt_tokenize_fn, model='gpt-3.5-turbo-instruct'),
    'gpt-3.5-turbo-1106': partial(gpt_tokenize_fn, model='gpt-3.5-turbo-1106'),
}

# Optional: Context lengths for each model, only needed if you want automatic input truncation.
context_lengths = {
    'text-davinci-003': 4097,
    'gpt-3.5-turbo-instruct': 4097,
}