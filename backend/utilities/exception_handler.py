class CustomException(Exception):
    def __init__(self, message: str, source_class: str):
        self.message = message
        self.source_class = source_class
        super().__init__(message)

    def __str__(self):
        return f"{self.source_class}: {self.message}"
