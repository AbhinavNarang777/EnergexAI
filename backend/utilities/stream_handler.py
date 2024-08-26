import json


async def stream_handler(generator_function, *args, **kwargs):
    try:
        async for data in generator_function(*args, **kwargs):
            yield data
    except Exception as e:
        yield 'data: [ERROR]\n\n'
        error_json = json.dumps({"error": str(e)})
        yield f'data: {error_json}\n\n'
        yield 'data: [DONE]\n\n'