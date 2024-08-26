EXCEL_GOAL = """
The table consist of below columns:

1. **Datetime**: This column records the timestamp of the data entry, typically in a format that includes both date and time. It serves as a reference point for understanding when the energy generation and demand occurred.

2. **Generation Coal**: This column measures the amount of electricity generated from coal in megawatts (MW). It reflects the contribution of coal-fired power plants to the overall energy mix at the given datetime.

3. **Generation Solar**: This column records the electricity generated from solar power sources in megawatts (MW). It indicates the role of solar energy in the electricity generation mix at the specific datetime.

4. **Generation Other Renewable**: This column captures the electricity generation from other renewable sources besides solar, such as wind, hydro, and biomass, in megawatts (MW). It shows the diversity of renewable energy sources contributing to the grid.

5. **Generation Outsourcing Estimated**: This column provides an estimation of the electricity generated through outsourcing, in megawatts (MW). This could include power sourced from other utilities or independent power producers not owned by the utility company.

6. **Demand**: This column indicates the total electricity demand at the datetime, measured in megawatts (MW). It represents the sum of all electricity required by consumers and businesses at that moment.

7. **Predicted**: This column contains the predicted electricity demand or generation for datetime, based on historical data and forecasting models. It helps in planning and ensuring the balance between supply and demand in the power grid.

Given this information, if a user queries specific data or requests an action, such as "Show me the solar generation for July 2018" or "Predict the demand for December 2017", the action will involve filtering, analyzing, or predicting data based on the columns relevant to the query. The system would then retrieve or calculate the requested information using the data stored in the appropriate columns.

USER QUERY = {user_query}
"""