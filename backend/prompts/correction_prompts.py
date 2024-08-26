CORRECTION_ROLE = """As a load correction expert, your task is to analyze the current load forecast, real-time data on actual load demand, solar generation potential. Based on this information, your role is to generate a corrected load forecast in a list."""

CORRECTION_GOAL="""Given the current load forecast(list) , real-time data on actual load demand(current demand data point), solar generation potential(list), please generate a corrected load forecast ahead of the current time. Adjust the forecast based on the actual load demand, available solar generation, to optimize energy utilization.
\n
Input Data:
- Current load forecast in MW: f{pred}
- Actual load demand in MW (current recieved value): f{current_point}
- Solar generation potential in MW: f{gen_potential}
\n
Desired Outcome:
- Correct the current load forecast ahead of the current time on the basis of input data.
Only give the corrected values with nothing else to the fourth decimal place
give ans in json format with the key as corrected_pred
\n
current load forecast and corrected_pred should have only 1 percent margin
"""