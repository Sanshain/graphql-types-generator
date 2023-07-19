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
							name,
							ofType{
								name
							}							
						}
					},						        
					description
					type {
						fields{								
							name,
							type{
								ofType{
									name,
									ofType {
										name,
										ofType{
										  name
										}
									}
								},
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
							name,
							# kind ::: for relay may be more exact detecting list/object
							ofType{
								ofType{
									name
								} 								
								name
							}											  
						}
					}
				}
			}
		}
	}
`