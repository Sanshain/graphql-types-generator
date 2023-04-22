//@ts-check

/**
 * @type {string}
 */
exports.schemaQuery = `
 	query Queries{
		__schema {
			types {
				name,
				fields {
					name,
					args{
						name,  
						type{
							name
						}
					},						        
					description
					type {
						fields{								
							name,
							type{
								name,
								kind,									
								fields{
									name,
									type{
										ofType{
											name
										}											
									}										
								}									
							}
						},			
						kind,				
						name,          
						ofType {
							name					  
						}
					}
				}
			}
		}
	}
`